import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoolNotificationPageRoutingModule } from './cool-notification-routing.module';

import { CoolNotificationPage } from './cool-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoolNotificationPageRoutingModule
  ],
  declarations: [CoolNotificationPage]
})
export class CoolNotificationPageModule {}
