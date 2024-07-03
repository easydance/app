import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrentParty, CurrentPartyProduct, CurrentPartyTable, ProductBaseDto } from 'src/app/apis';
import { Cart, FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  public table?: CurrentPartyTable;
  public party?: CurrentParty;
  public cart?: Cart<CurrentPartyProduct>;
  public currentDetail: number | undefined = undefined;

  public filteredProducts?: CurrentParty['products'];
  public filters?: string[];
  public selectFilters: string[] = [];

  public get categories() {
    return [...new Set(this.party?.products.map(p => p.category?.name).filter(x => x))].sort();
  }

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
    this.filteredProducts = this.party?.products;
  }

  next() {
    this.navCtrl.navigateForward('/full-immersion/summary');
  }

  goBack() {
    this.navCtrl.back();
  }

  selectDetail(product: CurrentPartyProduct) {
    if (this.currentDetail == product.id) {
      this.currentDetail = undefined;
      return;
    }
    this.currentDetail = product.id;
  }

  filterProduct(filters?: string[]) {
    if (!filters || filters.length == 0) {
      this.filteredProducts = this.party?.products;
      return;
    }
    this.filteredProducts = this.party?.products.filter(p => filters?.includes(p.category?.name));
  }

  toggleFilter(filter: string) {
    // if (this.selectFilters.includes(filter)) {
    //   this.selectFilters = this.selectFilters.filter(s => s != filter);
    // } else {
    //   this.selectFilters.push(filter);
    // }
    this.selectFilters = filter ? [filter] : [];
    this.filterProduct(this.selectFilters);
  }
}
