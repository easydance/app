import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { AuthService, ClubBaseDto, GetUserToClubFollowerResponseDto, LoginUserDataDto, UserService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef<HTMLDivElement & { swiper: any; }> | undefined;

  public user?: LoginUserDataDto = this.authManager.user;
  public isMe: boolean = true;
  public isEditingMode: boolean = false;

  public isOpenDeleteUserModal: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    public readonly authManager: AuthManagerService,
    private readonly route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async res => {
      this.user = (await lastValueFrom(this.usersService.findOne(res['id'], undefined))).data as any;
      this.isMe = res['id'] === (this.authManager.user?.id || 0);
    });
    this.authManager.user$.subscribe(res => {
      if (res && !this.route.snapshot.params['id']) {
        this.user = this.authManager.user;
        this.isMe = res['id'] === (this.authManager.user?.id || 0);
      }
    });

  }

  ionViewWillEnter() {

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
}
