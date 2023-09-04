import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoolNotificationPage } from './cool-notification.page';

const routes: Routes = [
  {
    path: '',
    component: CoolNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoolNotificationPageRoutingModule {}
