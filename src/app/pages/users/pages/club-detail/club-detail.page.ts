import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { AttachmentBaseDto, ClubBaseDto, ClubService, GetUserToClubFollowerResponseDto, PartyBaseDto, PartyService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-club-detail',
  templateUrl: './club-detail.page.html',
  styleUrls: ['./club-detail.page.scss'],
})
export class ClubDetailPage implements OnInit {

  public parties?: PartyBaseDto[];
  public club?: ClubBaseDto;
  public profile?: AttachmentBaseDto;
  public covers?: AttachmentBaseDto[];
  public isFollowing?: GetUserToClubFollowerResponseDto;

  constructor(
    private route: ActivatedRoute,
    private readonly authManager: AuthManagerService,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService,
    private readonly clubFollowerService: UserToClubFollowerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      const id = res['id'];
      this.clubsService.findOne(id, undefined, 'address').subscribe(res => {
        this.club = res.data;
        // const [profile, ...covers] = this.club.covers;
        this.profile = this.club.profile;
        this.covers = this.club.covers;
        this.partiesService.findAll(0, 20, JSON.stringify({ club: { id } })).subscribe(res => {
          this.parties = res.data.map(d => ({
            ...d,
            club: this.club!
          }));
        });
      });
      this.authManager.user$.subscribe(async res => {
        if (res) {
          const result = await lastValueFrom(this.clubFollowerService.findAll(0, 5, JSON.stringify({ user: { id: res?.id || 0 }, club: { id: id || 0 } })));
          this.isFollowing = result.data[0];
        }
      });
    });

  }


  goto(party: PartyBaseDto) {
    this.navCtrl.navigateForward('/event-detail/' + party.id);
  }

  goBack() {
    this.navCtrl.back();
  }

  unfollowClub() {
    if (this.isFollowing?.id) {
      this.clubFollowerService._delete(this.isFollowing.id).subscribe(res => {
        this.clubsService.findOne(this.club!.id, undefined, 'address').subscribe(res => {
          if(this.club) this.club.followerCount = res.data.followerCount;
        });
        this.isFollowing = undefined;
      });
    }
  }

  followClub() {
    this.clubFollowerService.create({
      club: { id: this.club?.id } as any,
      user: { id: this.authManager.user?.id } as any,
    }).subscribe(res => {
      this.clubsService.findOne(this.club!.id, undefined, 'address').subscribe(res => {
        if(this.club) this.club.followerCount = res.data.followerCount;
      });
      this.isFollowing = res.data;
    });
  }
}
