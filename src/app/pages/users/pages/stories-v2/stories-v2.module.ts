import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoriesV2PageRoutingModule } from './stories-v2-routing.module';

import { StoriesV2Page } from './stories-v2.page';
import { UiModule } from 'src/app/components/ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwipeDirective } from 'src/app/directives/swipe.directive';
import { BypassTypingPipe } from 'src/app/pipes/bypass-typing.pipe';
import { ShorterNumberPipe } from 'src/app/pipes/shorter-number.pipe';
import { StoryComponent } from 'src/app/pages/users/pages/stories-v2/components/story/story.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UiModule,
    BypassTypingPipe,
    SwipeDirective,
    ShorterNumberPipe,
    TranslateModule,
    StoriesV2PageRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [StoriesV2Page, StoryComponent],
  exports: [StoryComponent]
})
export class StoriesV2PageModule { }
