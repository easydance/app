import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ClubBaseDto, GetUserToUserFollowerResponseDto, PartyBaseDto, PartyService, UserBaseDto, UserService, UserToUserFollowerService } from 'src/app/apis';
import { FormsModule } from '@angular/forms';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';
import { UiModule } from 'src/app/components/ui.module';

export type StorySource = { type: 'video' | 'picture', src: string; party?: PartyBaseDto; usersTags: UserBaseDto[]; };

@Component({
  selector: 'recording-video-preview',
  templateUrl: './recording-video-preview.component.html',
  styleUrls: ['./recording-video-preview.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DirectivesModule, FormsModule, UiModule]
})
export class RecordingVideoPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('searchClubModal') searchClubModal?: IonModal;

  cameraPreviewOptions?: CameraPreviewOptions;
  recording: boolean = false;
  timer: number = 0;
  timerId: any;
  storyLimitId: any;
  parties: PartyBaseDto[] = [];
  users: UserBaseDto[] = [];

  source?: StorySource;
  @Output() mediaCreated: EventEmitter<StorySource> = new EventEmitter();
  @Output() videoCreated: EventEmitter<{}> = new EventEmitter();
  @Output() pictureCreated: EventEmitter<{}> = new EventEmitter();

  constructor(private partiesService: PartyService, private partiesUtils: CommonPartiesUtils, private usersService: UserService) { }

  ngOnInit(): void {
  }

  async ngOnDestroy() {
    this.stop();
  }

  async initializeCameraPreview() {
    try {
      await CameraPreview.stop();
    } catch (error) {
      console.error(error);
    }
    const storyPreview = document.querySelector<HTMLDivElement>('#story-preview');
    this.cameraPreviewOptions = {
      position: 'rear',
      // storeToFile: true,
      width: storyPreview?.clientWidth,
      height: storyPreview?.clientHeight,
      x: storyPreview?.offsetLeft,
      y: storyPreview?.offsetTop,
    };

    try {
      CameraPreview.start(this.cameraPreviewOptions);
    } catch (error) {
      console.error(error);
    }
  }

  async stop() {
    await CameraPreview.stop();
  }

  async captureImage() {
    const storyPreview = document.querySelector<HTMLDivElement>('#story-preview');
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 100,
      // width: storyPreview?.clientWidth,
      // height: storyPreview?.clientHeight,

    };

    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.pictureCreated.emit(result.value);

    this.source = {
      type: 'picture',
      src: result.value,
      usersTags: []
    };
    CameraPreview.stop();
  }

  async recordVideo() {
    if (this.cameraPreviewOptions && !this.recording) {
      await CameraPreview.startRecordVideo(this.cameraPreviewOptions);
      this.recording = true;
    }
  }

  async stopVideo() {
    const result = await CameraPreview.stopRecordVideo();
    this.recording = false;
    this.videoCreated.emit(result);
    const src = await this.getVideoUrl((<any>result).videoFilePath);
    this.source = {
      type: 'video',
      src,
      usersTags: [],
    };
    CameraPreview.stop();
  }

  private async getVideoUrl(fullPath: string) {
    const path = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    const file = await Filesystem.getUri({
      path: path,
      directory: Directory.Data
    });
    return file.uri;
  }

  startEvent() {
    this.timer = Date.now();
    this.timerId = setTimeout(() => {
      this.recordVideo();
    }, 500);
    this.storyLimitId = setTimeout(() => {
      if (this.recording) this.stopVideo();
    }, 15000);
  }

  endEvent() {
    const now = Date.now();
    if (now - this.timer < 500) {
      clearTimeout(this.timerId);
      this.captureImage();
      return;
    }
    if (this.recording) this.stopVideo();
    clearTimeout(this.storyLimitId);
  }

  reset() {
    this.source = undefined;
    CameraPreview.start(this.cameraPreviewOptions!);
  }

  goNext() {
    if (!this.source?.party) {
      this.searchClubModal?.present();
      return;
    }
    this.mediaCreated.emit(this.source!);
  }

  searchClubs($event: any) {
    this.partiesService.findAll(0, 5, JSON.stringify({
      title: { $containsIgnore: $event.target.value },
      ...this.partiesUtils.Filters().Tonight
    }), undefined, undefined, 'club').subscribe(res => {
      this.parties = res.data;
    });

  }

  searchUsers($event: any) {
    this.usersService.findAll(0, 10, JSON.stringify([
      { email: { $containsIgnore: $event.target.value } },
      { socials: { instagram: { username: { $containsIgnore: $event.target.value } } } },
      { socials: { twitter: { username: { $containsIgnore: $event.target.value } } } },
      { socials: { facebook: { username: { $containsIgnore: $event.target.value } } } },
    ]), undefined, undefined, 'club')
      .subscribe(users => {
        this.users = users.data;
      });
  }

}
