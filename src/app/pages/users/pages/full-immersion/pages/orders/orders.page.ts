import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { GetTableOrderResponseDto, TableOrderService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  public orders: GetTableOrderResponseDto[] = [];
  public groupedOrders: { [key: string]: GetTableOrderResponseDto[]; } = {};
  public pendingOrders: GetTableOrderResponseDto[] = [];

  constructor(
    private navCtrl: NavController,
    private ordersService: TableOrderService,
    private authManager: AuthManagerService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authManager.user$.subscribe(res => {
      if (res) {
        this.ordersService.findAll(0, 50, JSON.stringify({ user: { id: res?.id || 'NO-ID' } }),
          '{ "createdAt": "desc" }', undefined, 'table.club,rows.priceListItem.product').subscribe(res => {
            this.orders = res.data;
            this.groupedOrders = this.orders.reduce((groups, item) => {
              const date = item.createdAt ? DateTime.fromJSDate(new Date(item.createdAt)).toFormat('yyyy-LL-dd') : '-';
              const key = `${date}:|:${item.table.club.name}`;
              const group = (groups[key] || []);
              group.push(item);
              groups[key] = group;
              return groups;
            }, {} as { [key: string]: GetTableOrderResponseDto[]; });
            this.pendingOrders = this.orders.filter(o => {
              if (!o.createdAt) return false;
              const isTodayOrTomorrow = DateTime.fromJSDate(new Date(o.createdAt)).toFormat('yyyy-LL-dd') == DateTime.now().toFormat('yyyy-LL-dd')
                || DateTime.fromJSDate(new Date(o.createdAt)).toFormat('yyyy-LL-dd') == DateTime.now().plus({ days: 1 }).toFormat('yyyy-LL-dd');
              return isTodayOrTomorrow && ['CREATED', 'IN_PROGRESS'].includes(o.status);
            });
          });
        console.log(this.pendingOrders);
      }
    });
  }


  getOrdersGrouped() {
    return Object.keys(this.groupedOrders).map((key) => ({
      key,
      club: key.split(':|:')[1],
      date: key.split(':|:')[0].split('-').reverse().join('/'),
      value: this.groupedOrders[key]
    })).sort();
  }


  goBack() {
    this.navCtrl.back();
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'CREATED':
      case 'IN_PROGRESS':
        return 'Sta arrivando!';

      case 'COMPLETED':
      case 'PROCESSED':
      case 'DELIVERED':
        return 'Consegnato';

      case 'CANCELED':
        return 'ANNULLATO';

      default:
        return '-';
    }
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'CREATED':
      case 'IN_PROGRESS':
        return 'warning';

      case 'COMPLETED':
      case 'PROCESSED':
      case 'DELIVERED':
        return 'success';

      case 'CANCELED':
        return 'danger';

      default:
        return '-';
    }
  }
}
