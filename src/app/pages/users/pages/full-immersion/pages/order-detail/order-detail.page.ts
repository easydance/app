import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TableOrderBaseDto, TableOrderService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  public order?: TableOrderBaseDto;

  constructor(
    private navCtrl: NavController,
    private ordersService: TableOrderService,
    private authManager: AuthManagerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      if (res['id']) {
        this.ordersService.findOne(res['id'], undefined, 'table, rows..priceListItem.product').subscribe(res => {
          this.order = res.data;
        });
      }
    });
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
