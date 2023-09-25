import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoriesPageRoutingModule } from './stories-routing.module';

import { StoriesPage } from './stories.page';
import { UiModule } from 'src/app/components/ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoriesPageRoutingModule,
    UiModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [StoriesPage]
})
export class StoriesPageModule { }
