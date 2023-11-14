import { Component, OnInit } from '@angular/core';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  constructor(private authManager: AuthManagerService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authManager.me().subscribe(res => { });
    this.authManager.getCurrentPosition().catch(err => {
      console.error(err);
    });
  }

}
