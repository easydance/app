import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { ValidatorsDirective } from 'src/app/validators/form-conditions.validator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    FlatpickrModule,
    ValidatorsDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [RegisterPage]
})
export class RegisterPageModule { }
