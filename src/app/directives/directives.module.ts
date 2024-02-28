import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LongPressDirective } from 'src/app/directives/long-press.directive';

const components = [
  LongPressDirective
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class DirectivesModule { }
