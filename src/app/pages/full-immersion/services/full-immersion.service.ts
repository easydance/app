import { Injectable } from '@angular/core';
import { ClubBaseDto, CurrentParty, CurrentPartyProduct, CurrentPartyTable, ProductBaseDto, TableOrderBaseDto } from 'src/app/apis';

@Injectable({
  providedIn: 'root'
})
export class FullImmersionService {
  public orders?: TableOrderBaseDto[];
  public currentParty?: CurrentParty;
  public selectedClub?: ClubBaseDto;
  public selectedTable?: CurrentPartyTable;
  public cart: Cart<CurrentPartyProduct> = new Cart('price');
}

export class Cart<T extends { id?: any; }> {
  private priceKey: string;
  private items: { [key: string]: { qty: number, item: T; }; } = {};
  public get total() {
    return Object.keys(this.items).map(k => this.items[k].qty * (<any>this.items[k].item)[this.priceKey]).reduce((a, b) => a + b, 0);
  }
  public get totalQty() {
    return Object.keys(this.items).map(k => this.items[k].qty).reduce((a, b) => a + b, 0);
  }

  constructor(priceKey: string) {
    this.priceKey = priceKey;
  }

  get(item: T) {
    return this.items[item.id];
  }

  getQty(item: T) {
    return this.items[item.id]?.qty || 0;
  }

  add(item: T, n: number) {
    if (!this.items[item.id]) {
      this.items[item.id] = { qty: 0, item };
    }
    this.items[item.id].qty += n;
    if (this.items[item.id].qty <= 0) {
      delete this.items[item.id];
    }
  }

  getItems() {
    return Object.keys(this.items).map(k => this.items[k]);
  }

  clear() {
    this.items = {};
  }

}
