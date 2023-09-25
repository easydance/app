import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, NavController, Platform } from '@ionic/angular';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public showPassword: boolean = false;
  public username: string = '';
  public password: string = '';

  constructor(
    private readonly authManagerService: AuthManagerService,
    private readonly navCtrl: NavController,
    public readonly platform: Platform
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    if (this.authManagerService.isAuthenticated()) {
      this.navCtrl.navigateRoot('home');
      return;
    }
    GoogleAuth.initialize({
      clientId: '862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com',
      grantOfflineAccess: true,
      scopes: ['profile', 'email'],
    });
  }


  login() {
    this.authManagerService.login(this.username, this.password)
      .subscribe(res => {
        this.navCtrl.navigateRoot('home');
      });
  }

  async googleLogin() {
    const user = await GoogleAuth.signIn().catch(error => {
      console.error(error);
    });
    if (user) {
      this.authManagerService.signUp({}, user.authentication.accessToken).subscribe(res => {
        this.navCtrl.navigateRoot('home');
      });
    }
  }

}
