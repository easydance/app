import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';
import { EventDetailComponent } from 'src/app/pages/users/pages/event-detail/components/event-detail/event-detail.component';
import { UiModule } from 'src/app/components/ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailPageRoutingModule,
    GoogleMapsModule,
    UiModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [EventDetailPage, EventDetailComponent],
  exports: [EventDetailComponent]
})
export class EventDetailPageModule { }
