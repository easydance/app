import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ClubBaseDto, ClubService, GetUserToUserFollowerResponseDto, LoginUserDataDto, UserService, UserToClubFollowerService, UserToUserFollowerService } from 'src/app/apis';
import { UiModule } from 'src/app/components/ui.module';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, UiModule]
})
export class ProfileDetailComponent implements OnInit, OnChanges {

  @Input() public user?: LoginUserDataDto;
  @Input() public isMe: boolean = false;
  public clubs: ClubBaseDto[] = [];

  public isFollowing?: GetUserToUserFollowerResponseDto;

  @Output() edit: EventEmitter<void> = new EventEmitter();


  constructor(
    private usersService: UserService,
    private userFollowerService: UserToUserFollowerService,
    private authManager: AuthManagerService,
    private readonly clubFollowerService: UserToClubFollowerService,
    private readonly clubsService: ClubService,
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['user'].currentValue?.id != changes['user'].previousValue?.id) {
      const result = await lastValueFrom(this.userFollowerService.findAll(0, 5, JSON.stringify({
        follower: {
          id: this.authManager.user!.id || 0
        },
        followed: {
          id: changes['user'].currentValue?.id || 0
        }
      })));
      this.isFollowing = result.data[0];
      this.clubFollowerService.findAll(0, 8, JSON.stringify({ user: { id: this.user?.id || 'NO-ID' } }), undefined, undefined, 'club.address')
        .subscribe(res => {
          this.clubsService.findAll(0, 12, JSON.stringify({ id: { $in: res.data.map(d => d.club.id) } }), undefined, undefined, 'address').subscribe(clubsData => {
            this.clubs = clubsData.data;
          });
        });
    }
  }

  ngOnInit() {

  }

  unfollow() {
    if (this.isFollowing?.id) {
      this.userFollowerService._delete(this.isFollowing?.id).subscribe(res => {
        this.usersService.findOne(this.user!.id, undefined).subscribe(res => {
          this.user!.followers = res.data.followers;
        });
        this.isFollowing = undefined;
      });
    }
  }

  follow() {
    this.userFollowerService.create({
      followed: { id: this.user?.id } as any,
      follower: { id: this.authManager.user?.id } as any,
    }).subscribe(res => {
      this.usersService.findOne(this.user!.id, undefined).subscribe(res => {
        this.user!.followers = res.data.followers;
      });
      this.isFollowing = res.data;
    });
  }
}
