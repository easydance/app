import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cool-notification',
  templateUrl: './cool-notification.page.html',
  styleUrls: ['./cool-notification.page.scss'],
})
export class CoolNotificationPage implements OnInit {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() button?: string;
  @Input() returnUrl?: string;

  constructor(private route: ActivatedRoute, private navCtrl: NavController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      this.title = res['title'];
      this.subtitle = res['subtitle'];
      this.button = res['button'];
      this.returnUrl = res['returnUrl'];
    });
  }

  goTo(url: string | undefined) {
    if (url) {
      this.navCtrl.navigateRoot(url);
    }
  }

}
