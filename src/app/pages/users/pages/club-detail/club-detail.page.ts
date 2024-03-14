import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AttachmentBaseDto, ClubBaseDto, ClubService, GetUserResponseDto, GetUserToClubFollowerResponseDto, PartyBaseDto, PartyService, UserService, UserToClubFollowerService } from 'src/app/apis';
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
  public followers: GetUserResponseDto[] = [];


  constructor(
    private route: ActivatedRoute,
    private readonly authManager: AuthManagerService,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService,
    private readonly clubFollowerService: UserToClubFollowerService,
    private readonly toastCtrl: ToastController,
    private readonly usersService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      const id = res['id'];
      this.clubsService.findOne(id, undefined, 'address').subscribe(res => {
        this.club = res.data;
        // const [profile, ...covers] = this.club.covers;
        this.profile = this.club.profile;
        this.covers = this.club.covers.sort((a, b) => a.id == this.club?.currentCover ? -1 : 1);
        this.partiesService.findAll(0, 20, JSON.stringify({ club: { id }, to: { $gte: DateTime.now().toISO() } }), undefined, undefined, 'address').subscribe(res => {
          this.parties = res.data.map(d => ({
            ...d,
            club: this.club!
          }));
        });
      });

      this.clubFollowerService.findAll(0, 1000, JSON.stringify({ club: { id: id || 0 } }), undefined, undefined, 'user').subscribe(res => {
        this.usersService.findAll(0, 1000, JSON.stringify({
          id: { $in: res.data.map(d => d.user.id) }
        })).subscribe(res2 => {
          this.followers = res2.data;
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
          if (this.club) this.club.followerCount = res.data.followerCount;
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
        if (this.club) this.club.followerCount = res.data.followerCount;
      });
      this.isFollowing = res.data;
    });
  }

  async openOnBrowser(url: string) {
    if (!url.startsWith('http') && !url.startsWith('tel:') && !url.startsWith('mailto:')) {
      const toast = await this.toastCtrl.create({ message: 'Link non valido!', duration: 3000 });
      toast.present();
      return;
    }
    window.open(url, '_blank');
  }

  openModal(modal: IonModal | undefined) {
    modal?.present();
  }
}
