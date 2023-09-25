import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { EventDetailPageModule } from 'src/app/pages/users/pages/event-detail/event-detail.module';
import { UiModule } from 'src/app/components/ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    GoogleMapsModule,
    EventDetailPageModule,
    UiModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [MapPage]
})
export class MapPageModule { }
