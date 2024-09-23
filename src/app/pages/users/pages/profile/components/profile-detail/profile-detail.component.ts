import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonModal, IonicModule, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { ClubBaseDto, ClubService, GetUserResponseDto, GetUserToUserFollowerResponseDto, LoginUserDataDto, UserBaseDto, UserService, UserToClubFollowerService, UserToUserFollowerService } from 'src/app/apis';
import { UiModule } from 'src/app/components/ui.module';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, UiModule, RouterModule, TranslateModule]
})
export class ProfileDetailComponent implements OnInit, OnChanges {

  @Input() public user?: LoginUserDataDto;
  @Input() public isMe: boolean = false;
  public clubs: ClubBaseDto[] = [];

  public isFollowing?: GetUserToUserFollowerResponseDto;

  public followers: GetUserResponseDto[] = [];
  public followed: GetUserResponseDto[] = [];

  @Output() edit: EventEmitter<void> = new EventEmitter();


  constructor(
    private usersService: UserService,
    private userFollowerService: UserToUserFollowerService,
    private authManager: AuthManagerService,
    private readonly clubFollowerService: UserToClubFollowerService,
    private readonly clubsService: ClubService,
    private readonly toastCtrl: ToastController,
    private readonly translate: TranslateService
  ) {

  }

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
      this.clubFollowerService.findAll(
        0,
        8,
        JSON.stringify({ user: { id: this.user?.id || 'NO-ID' } }),
        undefined,
        undefined,
        'club.address'
      ).subscribe(res => {
        this.clubsService.findAll(
          0,
          12,
          JSON.stringify({ id: { $in: res.data.filter(x => x.club).map(d => d.club.id) } }),
          undefined,
          undefined,
          'address'
        ).subscribe(clubsData => {
          this.clubs = clubsData.data;
        });
      });

      const user = changes['user'].currentValue || this.authManager.user;
      // this.refreshSocials(user);
    }
  }

  ngOnInit() {

  }

  unfollow() {
    if (this.isFollowing?.id) {
      this.userFollowerService.set({ id: this.user?.id } as any).subscribe(res => {
        this.isFollowing = res.data || undefined;
      });
      // this.userFollowerService._delete(this.isFollowing?.id).subscribe(res => {
      //   // this.refreshSocials(this.user!);
      //   this.isFollowing = undefined;
      // });
    }
  }

  follow() {
    this.userFollowerService.set({ id: this.user?.id } as any).subscribe(res => {
      this.isFollowing = res.data || undefined;
    });
    // this.userFollowerService.create({
    //   followed: { id: this.user?.id } as any,
    //   follower: { id: this.authManager.user?.id } as any,
    // }).subscribe(res => {
    //   // this.refreshSocials(this.user!);
    //   this.isFollowing = res.data;
    // });
  }

  refreshSocials(user: { id?: number; }) {
    this.userFollowerService.findAll(0, 1000, JSON.stringify({
      follower: {
        id: user.id || 0
      }
    }), undefined, undefined, 'followed').subscribe(res => {

      this.usersService.findAll(0, 1000, JSON.stringify({
        id: { $in: res.data.filter(d => d.followed).map(d => d.followed.id) }
      })).subscribe(res => {
        this.followed = res.data;
      });
    });

    this.userFollowerService.findAll(0, 1000, JSON.stringify({
      followed: {
        id: user.id || 0
      }
    }), undefined, undefined, 'follower').subscribe(res => {
      this.usersService.findAll(0, 1000, JSON.stringify({
        id: { $in: res.data.filter(d => d.follower).map(d => d.follower.id) }
      })).subscribe(res => {
        this.followers = res.data;
      });
    });
  }

  openUsersList(type: 'follower' | 'followed', modal: IonModal) {
    if (type == 'follower' && this.user?.followers) {
      this.userFollowerService.findAll(0, 1000, JSON.stringify({
        followed: {
          id: this.user!.id || 0
        }
      }), undefined, undefined, 'follower').subscribe(res => {
        this.usersService.findAll(0, 1000, JSON.stringify({
          id: { $in: res.data.filter(d => d.follower).map(d => d.follower.id) }
        })).subscribe(res => {
          this.followers = res.data;
          modal.present();
        });
      });
      return;
    }

    if (type == 'followed' && this.user?.following) {
      this.userFollowerService.findAll(0, 1000, JSON.stringify({
        follower: {
          id: this.user!.id || 0
        }
      }), undefined, undefined, 'followed').subscribe(res => {

        this.usersService.findAll(0, 1000, JSON.stringify({
          id: { $in: res.data.filter(d => d.followed).map(d => d.followed.id) }
        })).subscribe(res => {
          this.followed = res.data;
          modal.present();
        });
      });
      return;
    }
  }

  async openOnBrowser(url: string) {
    if (!url.startsWith('http') && !url.startsWith('tel:') && !url.startsWith('mailto:')) {
      const toast = await this.toastCtrl.create({ message: this.translate.instant('APP.ERRORS.INVALID_LINK'), duration: 3000 });
      toast.present();
      return;
    }
    window.open(url, '_blank');
  }

}
