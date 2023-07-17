import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullImmersionPage } from './full-immersion.page';

const routes: Routes = [
  {
    path: '',
    component: FullImmersionPage
  },
  {
    path: 'scan',
    loadChildren: () => import('./pages/scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'select-table',
    loadChildren: () => import('./pages/select-table/select-table.module').then( m => m.SelectTablePageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'summary',
    loadChildren: () => import('./pages/summary/summary.module').then( m => m.SummaryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullImmersionPageRoutingModule {}
