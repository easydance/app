import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubDetailPageRoutingModule } from './club-detail-routing.module';

import { ClubDetailPage } from './club-detail.page';
import { UiModule } from 'src/app/components/ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClubDetailPageRoutingModule,
    UiModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ClubDetailPage]
})
export class ClubDetailPageModule { }
