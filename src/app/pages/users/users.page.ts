import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  static tabClicked: EventEmitter<string> = new EventEmitter();

  constructor(private authManager: AuthManagerService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.authManager.getToken()) this.authManager.me().subscribe(res => { });
    this.authManager.getCurrentPosition().catch(err => {
      console.error(err);
    });
  }

  emitTabClicked($event: string) {
    UsersPage.tabClicked.emit($event);
  }

}
