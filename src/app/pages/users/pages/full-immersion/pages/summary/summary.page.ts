import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrentPartyProduct, CurrentPartyTable, TableOrderService } from 'src/app/apis';
import { Cart, FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  public table?: CurrentPartyTable;
  public cart?: Cart<CurrentPartyProduct>;

  constructor(
    private navCtrl: NavController,
    private readonly fullImmersionService: FullImmersionService,
    private readonly tableOrderService: TableOrderService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.table = this.fullImmersionService.selectedTable;
    this.cart = this.fullImmersionService.cart;
  }

  next() {
    const cart = this.fullImmersionService.cart;
    const rows = cart.getItems().map(i => ({
      productId: i.item.id,
      qty: i.qty
    }));
    this.tableOrderService.create({
      rows,
      table: this.fullImmersionService.selectedTable!.id
    }).subscribe(res => {
      this.cart?.clear();
      this.navCtrl.navigateForward('/cool-notification', {
        queryParams: {
          title: 'ORDINE INVIATO',
          subtitle: 'Goditi la serata perchè la pasticca che hai preso prima potrebbe andarti di traverso oppure farti avere un bad trip',
          button: 'CHIUDI',
          returnUrl: '/home'
        }
      });
    });

  }

  goBack() {
    this.navCtrl.back();
  }
}
