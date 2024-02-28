import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanDeactivateFn } from '@angular/router';

import { ScanPage } from './scan.page';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const scanPageGuard: CanDeactivateFn<ScanPage> = (
  component: ScanPage,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return component.canLeave;
};

const routes: Routes = [
  {
    path: '',
    component: ScanPage,
    canDeactivate: [scanPageGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanPageRoutingModule { }
