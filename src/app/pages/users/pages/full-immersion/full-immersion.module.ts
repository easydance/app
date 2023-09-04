import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FullImmersionPageRoutingModule } from './full-immersion-routing.module';

import { FullImmersionPage } from './full-immersion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullImmersionPageRoutingModule
  ],
  declarations: [FullImmersionPage]
})
export class FullImmersionPageModule {}
