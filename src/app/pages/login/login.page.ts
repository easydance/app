import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { catchError, throwError } from 'rxjs';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';

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
    public readonly platform: Platform,
    private readonly toastCtrl: ToastController
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
    this.authManagerService.login(this.username, this.password).pipe(
      catchError(err => {
        if (err.status = 401) {
          this.toastCtrl.create({ message: 'Email e/o password non valide!', duration: 3000 })
            .then(toast => {
              toast.present();
            });
          return throwError(() => err);
        }
        this.toastCtrl.create({ message: 'Non è stato possibile accedere', duration: 3000 })
          .then(toast => {
            toast.present();
          });
        return throwError(() => err);

      })
    ).subscribe(res => {
      this.navCtrl.navigateRoot('home');
    });
  }

  async googleLogin() {
    const user = await GoogleAuth.signIn().catch(error => {
      this.toastCtrl.create({ message: 'Non è stato possibile accedere con Google', duration: 3000 })
        .then(toast => {
          toast.present();
        });
      console.error(error);
    });
    if (user) {
      this.authManagerService.signUp({}, user.authentication.accessToken, 'google').subscribe(res => {
        this.navCtrl.navigateRoot('home');
      });
    }
  }

  async appleSignIn() {
    let options: SignInWithAppleOptions = {
      clientId: 'app.easydance',
      redirectURI: '',
      scopes: 'email name',
      nonce: 'nonce',
    };

    try {
      const result: SignInWithAppleResponse = await SignInWithApple.authorize(options);

      if (result) {
        this.authManagerService.signUp({
          email: result.response.email,
          name: result.response.givenName,
          surname: result.response.familyName
        }, result.response.identityToken, 'apple').pipe(
          catchError(err => {
            this.toastCtrl.create({ message: 'Non è stato possibile completare la registrazione', duration: 3000 }).then(toast => {
              toast.present();
            });
            return throwError(() => err);
          })
        ).subscribe(res => {
          this.navCtrl.navigateRoot('home');
        });
      }
    } catch (error: any) {
      if (!error.message.includes('1001')) {
        const toast = await this.toastCtrl.create({ message: 'Non è stato possibile completare la registrazione: ' + error.message, duration: 3000 });
        toast.present();
      }

    }
  }

  goBack() {
    this.navCtrl.navigateBack('/');
  }

}
