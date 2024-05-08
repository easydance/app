import { Component, NgZone } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Keyboard } from "@capacitor/keyboard";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { StatusBar, Style } from '@capacitor/status-bar';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { InstanceLogService } from 'src/app/services/instance-log.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import * as swiper from 'swiper/element/bundle';
swiper.register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(
    private translationService: TranslateService,
    private pushNotification: PushNotificationService,
    private platform: Platform,
    private ngZone: NgZone,
    private navCtrl: NavController,
    private webSocket: WebSocketService,
    private logger: InstanceLogService
  ) {

    ScreenOrientation.lock({ orientation: 'portrait-primary' });
    StatusBar.setStyle({ style: Style.Dark });

    try {
      this.webSocket.connect();
    } catch (error) {
      console.warn('[WEB SOCKET] Web socket not connected!');
      console.error(error);
    }

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.ngZone.run(() => {
        // Example url: https://my-ionic.app/tabs/tab2
        // slug = /tabs/tab2
        const relativePath = event.url.split(".app").pop();
        if (relativePath) {
          const [slug, qs] = relativePath.split("?");
          console.log("slug = ", slug, 'qs', qs);
          if (slug) {
            this.navCtrl.navigateForward(slug, { queryParams: qs ? Object.fromEntries([...new URLSearchParams(qs)]) : {} });
            return;
          }
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });

    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });
    Keyboard.addListener('keyboardDidHide', () => {
      document.body.classList.remove('keyboard-open');
    });

    const lang = localStorage.getItem('lang') || this.translationService.getBrowserLang() || 'it';
    this.translationService.use(lang);
    setInterval(() => {
      this.translationService.reloadLang(lang).subscribe(res => {
        console.log('Reload i18n', res);
      });

    }, 5 * 60 * 1000);

    this.platform.ready().then(res => {
      this.logger.info('App ready', 'app.component.ts', {});
      this.pushNotification.initialize();
      const googleAuthClientId = window.EASY_KEYS?.['GOOGLE_AUTH_CLIENT_ID'] || '862020674291-6ltb6ufrfmupsdhi2irtg68ba0eqg2ib.apps.googleusercontent.com';
      console.log("Google auth client id:", googleAuthClientId);
      GoogleAuth.initialize({
        clientId: googleAuthClientId,
        grantOfflineAccess: true,
        scopes: ['profile', 'email'],
      });
    }).catch(err => {
      console.error(err);
      this.logger.error('App ready', 'app.component.ts', {});
    });

  }

}
