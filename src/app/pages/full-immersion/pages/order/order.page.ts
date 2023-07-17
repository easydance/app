import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrentParty, CurrentPartyProduct, CurrentPartyTable, ProductBaseDto } from 'src/app/apis';
import { Cart, FullImmersionService } from 'src/app/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  public table?: CurrentPartyTable;
  public party?: CurrentParty;
  public cart?: Cart<CurrentPartyProduct>;

  constructor(
    private navCtrl: NavController,
    private readonly fullImmersionService: FullImmersionService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.table = this.fullImmersionService.selectedTable;
    this.cart = this.fullImmersionService.cart;
    this.party = this.fullImmersionService.currentParty;
  }

  next() {
    this.navCtrl.navigateForward('/full-immersion/summary');
  }

  goBack() {
    this.navCtrl.back();
  }
}
