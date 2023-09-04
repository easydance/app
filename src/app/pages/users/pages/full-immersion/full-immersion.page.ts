import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'app-full-immersion',
  templateUrl: './full-immersion.page.html',
  styleUrls: ['./full-immersion.page.scss'],
})
export class FullImmersionPage implements OnInit {

  constructor(
    private readonly fullImmersionService: FullImmersionService,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.fullImmersionService.getOrders().subscribe(res => {
      setTimeout(() => {
        if ((this.fullImmersionService.orders?.length || 0) > 0) {
          return this.navCtrl.navigateForward('/full-immersion/orders');
        }
        return this.navCtrl.navigateForward('/full-immersion/scan');
      }, 2000);
    });
  }


}
