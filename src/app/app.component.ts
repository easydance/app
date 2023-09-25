import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import * as swiper from 'swiper/element/bundle';
swiper.register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(private readonly authManager: AuthManagerService, private readonly platform: Platform) {
    this.authManager.getCurrentPosition().catch(err => {
      console.error(err);
    });
  }

}
