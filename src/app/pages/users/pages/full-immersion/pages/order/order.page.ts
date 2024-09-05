import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CurrentParty, CurrentPartyProduct, CurrentPartyTable, ProductBaseDto } from 'src/app/apis';
import { Cart, FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';
import { Keyboard } from "@capacitor/keyboard";

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  public searchTerm: string = '';

  public table?: CurrentPartyTable;
  public party?: CurrentParty;
  public cart?: Cart<CurrentPartyProduct>;
  public currentDetail: number | undefined = undefined;

  public filteredProducts?: CurrentParty['products'];
  public filters?: string[];
  public selectFilters: string[] = [];

  public showOrderButton: boolean = true;

  public get categories() {
    return [...new Set(this.party?.products.map(p => p.category?.name).filter(x => x))].sort();
  }

  constructor(
    private navCtrl: NavController,
    private readonly fullImmersionService: FullImmersionService,
    private readonly changeDetector: ChangeDetectorRef
  ) {

    Keyboard.addListener('keyboardWillShow', () => {
      this.showOrderButton = false;
      this.changeDetector.detectChanges();
    });
    Keyboard.addListener('keyboardDidHide', () => {
      this.showOrderButton = true;
      this.changeDetector.detectChanges();
    });
  }

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
    // if (!filters || filters.length == 0) {
    //   this.filteredProducts = this.party?.products;
    //   return;
    // }
    const filtersSearch = filters && filters.length ? filters : this.party?.products.map(p => p.category?.name) || [];
    this.filteredProducts = this.party?.products.filter(p => filtersSearch.includes(p.category?.name) && p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
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
