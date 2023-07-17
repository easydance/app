import { Component } from '@angular/core';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import * as swiper from 'swiper/element/bundle';
swiper.register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isAuthenticated: boolean = false;

  constructor(private readonly authManager: AuthManagerService) {
    this.authManager.getCurrentPosition();
    this.isAuthenticated = this.authManager.isAuthenticated();
    this.authManager.user$.subscribe(res => {
      this.isAuthenticated = this.authManager.isAuthenticated();
    });
  }
}
