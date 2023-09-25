import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaCapture } from "@awesome-cordova-plugins/media-capture/ngx";
import { File } from "@awesome-cordova-plugins/file/ngx";

import { IonicModule } from '@ionic/angular';

import { StoryPageRoutingModule } from './story-routing.module';

import { StoryPage } from './story.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryPageRoutingModule
  ],
  providers: [MediaCapture, File],
  declarations: [StoryPage]
})
export class StoryPageModule {}
