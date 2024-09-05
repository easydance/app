import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { NavController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
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
  public showOrderButton: boolean = true;
  public note: string = '';
  public forceDisabled: boolean = false;

  constructor(
    private navCtrl: NavController,
    private readonly fullImmersionService: FullImmersionService,
    private readonly tableOrderService: TableOrderService,
    private readonly changeDetector: ChangeDetectorRef,
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
  }

  next() {
    this.forceDisabled = true;
    const cart = this.fullImmersionService.cart;
    const rows = cart.getItems().map(i => ({
      productId: i.item.id,
      qty: i.qty
    }));
    this.tableOrderService.create({
      rows,
      note: this.note,
      table: this.fullImmersionService.selectedTable!.id
    }).pipe(
      catchError(err => {
        this.forceDisabled = false;
        return throwError(() => err);
      })
    ).subscribe(res => {
      this.forceDisabled = false;
      this.cart?.clear();
      this.navCtrl.navigateForward('/cool-notification', {
        queryParams: {
          title: 'ORDINE INVIATO',
          subtitle: 'A breve riceverai il tuo ordine, nel frattempo goditi la serata!',
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
