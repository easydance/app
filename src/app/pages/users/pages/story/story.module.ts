import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryPageRoutingModule } from './story-routing.module';

import { StoryPage } from './story.page';
import { RecordingVideoPreviewComponent } from 'src/app/pages/users/pages/story/components/recording-video-preview/recording-video-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryPageRoutingModule,
    RecordingVideoPreviewComponent
  ],
  providers: [],
  declarations: [StoryPage]
})
export class StoryPageModule {}
