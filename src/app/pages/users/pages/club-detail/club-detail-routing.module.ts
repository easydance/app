import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubDetailPage } from './club-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ClubDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubDetailPageRoutingModule {}
