import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoginUserDataDto } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user?: LoginUserDataDto = this.authManager.user;

  constructor(
    private readonly authManager: AuthManagerService,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authManager.me().subscribe(res => {
      this.user = res;
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
