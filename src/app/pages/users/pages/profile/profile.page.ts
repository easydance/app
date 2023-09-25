import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { LoginUserDataDto, UserService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user?: LoginUserDataDto = this.authManager.user;
  public isMe: boolean = true;

  constructor(
    private readonly usersService: UserService,
    private readonly authManager: AuthManagerService,
    private readonly route: ActivatedRoute,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async res => {
      this.user = (await lastValueFrom(this.usersService.findOne(res['id']))).data as any;
    });
    this.authManager.user$.subscribe(res => {
      if (res) {
        this.user = this.authManager.user;
        this.isMe = res?.id === (this.authManager.user?.id || 0);
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
}
