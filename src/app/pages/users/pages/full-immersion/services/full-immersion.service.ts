import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ClubBaseDto, CurrentParty, CurrentPartyProduct, CurrentPartyTable, ProductBaseDto, TableOrderBaseDto, TableOrderService } from 'src/app/apis';

@Injectable({
  providedIn: 'root'
})
export class FullImmersionService {
  public orders?: TableOrderBaseDto[];
  private _currentParty?: CurrentParty;
  public get currentParty() {
    return this._currentParty;
  }
  private _selectedClub?: ClubBaseDto;
  public get selectedClub() {
    return this._selectedClub;
  }
  private _selectedTable?: CurrentPartyTable;
  public get selectedTable() {
    return this._selectedTable;
  }
  public cart: Cart<CurrentPartyProduct> = new Cart('price');
  public expireIn?: number;

  constructor(private ordersService: TableOrderService) {
    const persistedData = localStorage.getItem('full-immersion');
    if (persistedData) {
      try {
        const data = JSON.parse(persistedData);
        if (Date.now() < data.expireIn) {
          this._currentParty = data.currentParty;
          this._selectedClub = data.selectedClub;
          this._selectedTable = data.selectedTable;
          this.expireIn = data.expireIn;
        } else {
          localStorage.removeItem('full-immersion');
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('full-immersion');
      }
    }
  }

  getOrders() {
    return this.ordersService.findAll().pipe(tap(res => {
      this.orders = res.data;
      return res;
    }));
  }

  persist() {
    const data = {
      currentParty: this.currentParty,
      selectedClub: this.selectedClub,
      selectedTable: this.selectedTable,
      expireIn: this.expireIn
    };
    localStorage.setItem('full-immersion', JSON.stringify(data));
  }

  setCurrentParty(party: CurrentParty) {
    this._selectedTable = undefined;
    this._currentParty = party;
    this.expireIn = new Date(party.to).getTime();
    this.persist();
  }

  setSelectedClub(club: ClubBaseDto) {
    this._selectedClub = club;
    this._selectedTable = undefined;
    this._currentParty = undefined;
    this.persist();
  }

  setSelectedTable(table: CurrentPartyTable) {
    this._selectedTable = table;
    this.persist();
  }
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
