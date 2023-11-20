import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

import { ForgotPasswordPage } from './forgot-password.page';
import { ValidatorsDirective } from 'src/app/validators/form-conditions.validator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    ValidatorsDirective

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
