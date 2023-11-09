import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ProfileDetailComponent } from 'src/app/pages/users/pages/profile/components/profile-detail/profile-detail.component';
import { ProfileEditComponent } from 'src/app/pages/users/pages/profile/components/profile-edit/profile-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ProfileDetailComponent,
    ProfileEditComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProfilePage]
})
export class ProfilePageModule { }
