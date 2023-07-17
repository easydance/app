import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, NavController } from '@ionic/angular';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

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
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    if (this.authManagerService.isAuthenticated()) {
      this.navCtrl.navigateRoot('home');
    }
  }


  login() {
    this.authManagerService.login(this.username, this.password)
      .subscribe(res => {
        this.navCtrl.navigateRoot('home');
      });
  }

}
