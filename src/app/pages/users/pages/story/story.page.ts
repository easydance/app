import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecordingVideoPreviewComponent } from 'src/app/pages/users/pages/story/components/recording-video-preview/recording-video-preview.component';

@Component({
  selector: 'story-page',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {

  @ViewChild('recordingVideoPreview') recordingVideoPreview?: RecordingVideoPreviewComponent;

  constructor() { }

  async ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.recordingVideoPreview?.initializeCameraPreview();
    }, 1000);
  }

  ionViewWillLeave() {
    this.recordingVideoPreview?.stop();
  }

}
