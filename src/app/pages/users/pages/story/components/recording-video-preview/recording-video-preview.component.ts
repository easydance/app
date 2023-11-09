import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CanvasCamera } from 'com.virtuoworks.cordova-plugin-canvascamera';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';

@Component({
  selector: 'recording-video-preview',
  templateUrl: './recording-video-preview.component.html',
  styleUrls: ['./recording-video-preview.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RecordingVideoPreviewComponent implements OnInit, OnDestroy {
  CanvasCamera: CanvasCamera = (<any>window).plugin.CanvasCamera;
  cameraPreviewOptions?: CameraPreviewOptions;
  recording: boolean = false;

  @Output() videoCreated: EventEmitter<{}> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stop();
  }

  initializeCameraPreview() {
    const storyPreview = document.querySelector<HTMLDivElement>('#story-preview');
    this.cameraPreviewOptions = {
      position: 'rear',
      width: storyPreview?.clientWidth,
      height: storyPreview?.clientHeight,
      x: storyPreview?.offsetLeft,
      y: storyPreview?.offsetTop,

    };
    CameraPreview.start(this.cameraPreviewOptions);
  }

  async recordVideo() {
    if (this.cameraPreviewOptions) {
      await CameraPreview.startRecordVideo(this.cameraPreviewOptions);
      this.recording = true;
    }
  }

  async stopVideo() {
    const result = await CameraPreview.stopRecordVideo();
    this.recording = false;
    this.videoCreated.emit(result);
  }

  stop() {
    this.CanvasCamera.stop();
  }

}
