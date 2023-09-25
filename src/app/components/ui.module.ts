import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { CardSliderComponent } from 'src/app/components/card-slider/card-slider.component';
import { IonicModule } from '@ionic/angular';
import { PartyCardComponent } from 'src/app/components/party-card/party-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClubsGridComponent } from 'src/app/components/clubs-grid/clubs-grid.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { RouterModule } from '@angular/router';
import { SuggestButtonsComponent } from 'src/app/components/suggest-buttons/suggest-buttons.component';
import { ThatsAllComponent } from 'src/app/components/thats-all/thats-all.component';
import { ItemsListComponent } from 'src/app/components/items-list/items-list.component';
import { UsersWidgetComponent } from 'src/app/components/users-widget/users-widget.component';

const components = [
  CardListComponent, CardSliderComponent, PartyCardComponent,
  ClubsGridComponent, TabsComponent, SuggestButtonsComponent,
  ThatsAllComponent, ItemsListComponent, UsersWidgetComponent
];

@NgModule({
  declarations: components,
  exports: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class UiModule { }
