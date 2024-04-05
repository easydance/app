import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AttachmentBaseDto, ClubBaseDto, ClubReviewService, ClubService, GetClubResponseDto, GetUserResponseDto, GetUserToClubFollowerResponseDto, PartyBaseDto, PartyService, UserService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-club-detail',
  templateUrl: './club-detail.page.html',
  styleUrls: ['./club-detail.page.scss'],
})
export class ClubDetailPage implements OnInit {

  @ViewChild('modal') modal?: IonModal;

  public parties?: PartyBaseDto[];
  public club?: GetClubResponseDto;
  public profile?: AttachmentBaseDto;
  public covers?: AttachmentBaseDto[];
  public isFollowing?: GetUserToClubFollowerResponseDto;
  public followers: GetUserResponseDto[] = [];

  public score: number = 0;

  public get rating() {
    if (this.club?.rating) {
      return (Math.round(this.club.rating * 10) / 10).toFixed(1).replace('.0', '');
    }
    return '-';
  }


  constructor(
    private route: ActivatedRoute,
    private readonly authManager: AuthManagerService,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService,
    private readonly clubFollowerService: UserToClubFollowerService,
    private readonly toastCtrl: ToastController,
    private readonly usersService: UserService,
    private readonly reviewsService: ClubReviewService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly webSocket: WebSocketService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      const id = res['id'];
      // if (this.club) this.webSocket.unsubscribe(`clubs/${this.club.id}/follow`);
      this.clubsService.findOne(id, undefined, 'address').subscribe(res => {
        this.club = res.data;
        this.score = res.data.userReview?.rate || 0;
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
        if (this.authManager.isAuthenticated()) {
          this.usersService.findAll(0, 1000, JSON.stringify({
            id: { $in: res.data.map(d => d.user?.id).filter(x => x) }
          })).subscribe(res2 => {
            this.followers = res2.data;
          });
        }

      });

      this.authManager.user$.subscribe(async res => {
        if (res) {
          const result = await lastValueFrom(this.clubFollowerService.findAll(0, 5, JSON.stringify({ user: { id: res?.id || 0 }, club: { id: id || 0 } })));
          this.isFollowing = result.data[0];
        }
      });

      // this.webSocket.wbReady$.subscribe(res => {
      //   if (res && this.club) {
      //     this.webSocket.subscribe(`clubs/${this.club.id}/follow`).subscribe(r => {
      //       if (this.club) {
      //         this.club.followerCount = r.data.followers;
      //       }
      //     });
      //   }
      // });
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
    if (this.authManager.isAuthenticated()) {
      this.clubFollowerService.create({
        club: { id: this.club?.id } as any,
        user: { id: this.authManager.user?.id } as any,
      }).subscribe(res => {
        this.clubsService.findOne(this.club!.id, undefined, 'address').subscribe(res => {
          if (this.club) this.club.followerCount = res.data.followerCount;
        });
        this.isFollowing = res.data;
        this.modal?.present();
      });

      return;
    }
    this.toastCtrl.create({ duration: 3000, message: 'Devi essere registrato per poter usufruire di questa funzionalità!' })
      .then(toast => {
        toast.present();
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
    if (this.authManager.isAuthenticated()) {
      modal?.present();
      return;
    }
    this.toastCtrl.create({ duration: 3000, message: 'Devi essere registrato per poter usufruire di questa funzionalità!' })
      .then(toast => {
        toast.present();
      });
  }

  setScore(score: number) {
    if (this.isFollowing && this.club) {
      this.score = score;
      this.changeDetector.detectChanges();
      this.reviewsService.set({
        club: this.club.id!,
        rate: this.score
      }).subscribe(res => {
        this.clubsService.findOne(this.club!.id, undefined)
          .subscribe(res => {
            this.club!.rating = res.data.rating;
            this.changeDetector.detectChanges();
          });
      });
    }
  }
}
