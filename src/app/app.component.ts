import { Component } from '@angular/core';
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';
import * as swiper from 'swiper/element/bundle';
swiper.register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private translationService: TranslateService) {
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });
    Keyboard.addListener('keyboardDidHide', () => {
      document.body.classList.remove('keyboard-open');
    });

    const lang = 'it';
    this.translationService.use(lang);
    setInterval(() => {
      this.translationService.reloadLang(lang).subscribe(res => {
        console.log('Reload i18n', res);
      });

    }, 5 * 60 * 1000);
  }

}
