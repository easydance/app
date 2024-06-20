import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';
import { AuthService, ClubBaseDto, GetLanguageResponseDto, GetUserToClubFollowerResponseDto, LanguageService, LoginUserDataDto, UserService, UserToClubFollowerService } from 'src/app/apis';
import { ProfileDetailComponent } from 'src/app/pages/users/pages/profile/components/profile-detail/profile-detail.component';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { StoryController } from 'src/app/services/story.controller';
import { VersionUpdaterService } from 'src/app/services/version-updater.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef<HTMLDivElement & { swiper: any; }> | undefined;
  @ViewChild('profileDetail') profileDetail?: ProfileDetailComponent;

  public user?: LoginUserDataDto = this.authManager.user;
  public isMe: boolean = true;
  public isEditingMode: boolean = false;

  public isOpenDeleteUserModal: boolean = false;
  public currentlang: string = this.translate.currentLang;
  public languages: GetLanguageResponseDto[] = [];
  public version: string = '';

  public get hasStories(): boolean {
    return !!this.storiesCtrl.users?.find(u => u.id == (this.user?.id || 'NO-ID'))?.stories.length;
  };

  public options: { enableNotification: boolean; } = {
    enableNotification: !localStorage.getItem('enableNotification') || localStorage.getItem('enableNotification') == 'true'
  };

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    public readonly authManager: AuthManagerService,
    private readonly route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly toastCtrl: ToastController,
    private readonly webSocket: WebSocketService,
    private readonly translate: TranslateService,
    private readonly languagesService: LanguageService,
    private readonly storiesCtrl: StoryController
  ) {
    VersionUpdaterService.getVersion().then(res => {
      this.version = res;
    });
  }

  ngOnInit() {
    this.languagesService.findAll(0, 100)
      .subscribe(res => {
        this.languages = res.data;
      });


    this.route.params.subscribe(async res => {
      if (this.user) this.webSocket.unsubscribe(`users/${this.user.id}/follow`);
      if (!res['id']) {
        this.user = this.authManager.user;
        this.isMe = true;
      } else {
        this.user = (await lastValueFrom(this.usersService.findOne(res['id'], undefined))).data as any;
        this.isMe = res['id'] == (this.authManager.user?.id || 0);
      }
      this.webSocket.wbReady$.subscribe(res => {
        if (res && this.user) {
          this.webSocket.subscribe(`users/${this.user.id}/follow`).subscribe(r => {
            if (this.user) {
              this.user.followers = r.data.followers;
              this.user.following = r.data.following;
            }
          });
        }
      });
    });
  }

  ionViewWillEnter() {
    if (!this.route.snapshot.params['id']) {
      this.authManager.me().subscribe(res => { });
    }
  }

  ionViewDidLeave() {
  }

  goBack() {
    this.navCtrl.back();
  }

  logout() {
    this.authManager.logout();
    this.navCtrl.navigateRoot('/login');
  }

  confirmDeleteUser() {
    this.authService.requestDelete().subscribe(res => {
      this.isOpenDeleteUserModal = false;
      const message = this.authManager.user?.providerAuthName
        ? 'L\'utente è stato cancellato con successo!'
        : 'Ti è stata inviata una mail all\'indirizzo dell\'account, conferma l\'eliminazione sulla mail';
      this.toastCtrl.create({ duration: 3000, message }).then(toast => {
        toast.present();
        if (this.authManager.user?.providerAuthName) {
          this.logout();
        }
      });
    });
  }

  share() {
    Share.share({
      title: 'Scopri il mio profilo',
      text: 'Scopri il mio profilo',
      url: 'https://share.easydance.app/p/' + this.user?.id,
      dialogTitle: 'Condividi il tuo profilo con i tuoi amici',
    });
  }

  setEnableNotification() {
    if (this.options.enableNotification) {
      localStorage.setItem('enableNotification', 'true');
    } else {
      localStorage.setItem('enableNotification', 'false');
    }
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  showStories() {
    this.navCtrl.navigateForward(`/users/${this.user?.id}/stories`, {
      queryParams: {
        // filter: JSON.stringify({
        //   user: { id: this.user?.id || 'NO-ID' },
        //   createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() }
        // }),
        type: 'page',
      },
    });
  }
}
