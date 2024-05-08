import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoriesV2Page } from './stories-v2.page';

const routes: Routes = [
  {
    path: '',
    component: StoriesV2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoriesV2PageRoutingModule {}
