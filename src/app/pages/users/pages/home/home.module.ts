import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { UiModule } from 'src/app/components/ui.module';
import { StoryPageModule } from 'src/app/pages/users/pages/story/story.module';
import { RecordingVideoPreviewComponent } from 'src/app/pages/users/pages/story/components/recording-video-preview/recording-video-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    UiModule,
    StoryPageModule,
    RecordingVideoPreviewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage]
})
export class HomePageModule {}
