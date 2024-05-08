import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { PartyBaseDto, PartyService, UserBaseDto, UserService } from 'src/app/apis';
import { FormsModule } from '@angular/forms';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';
import { UiModule } from 'src/app/components/ui.module';
import { TranslateModule } from '@ngx-translate/core';

export type StorySource = { type: 'video' | 'picture', src: string; party?: PartyBaseDto; usersTags: UserBaseDto[]; };

@Component({
  selector: 'recording-video-preview',
  templateUrl: './recording-video-preview.component.html',
  styleUrls: ['./recording-video-preview.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DirectivesModule, FormsModule, UiModule, TranslateModule]
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
  selectedUsers: UserBaseDto[] = [];
  storyHeight: number = (document.body.clientWidth / 9) * 16;

  torchSetting: 'torch' | 'off' = 'off';

  source?: StorySource;
  @Output() close: EventEmitter<void> = new EventEmitter();
  @Output() cameraInitialize: EventEmitter<void> = new EventEmitter();
  @Output() mediaCreated: EventEmitter<StorySource> = new EventEmitter();
  @Output() videoCreated: EventEmitter<{}> = new EventEmitter();
  @Output() pictureCreated: EventEmitter<{}> = new EventEmitter();

  constructor(private partiesService: PartyService, private partiesUtils: CommonPartiesUtils, private usersService: UserService) { }

  ngOnInit(): void {
    this.initializeCameraPreview()
  }

  async ngOnDestroy() {
    // this.stop();
    this.unsetupForCamera();
  }

  setupForCamera() {
    const ionRouterOutlet = document.querySelector<HTMLDivElement>('ion-router-outlet');
    if (ionRouterOutlet) {
      ionRouterOutlet.style.display = 'none';
      document.body.style.background = 'transparent';
    }
  }

  unsetupForCamera() {
    const ionRouterOutlet = document.querySelector<HTMLDivElement>('ion-router-outlet');
    if (ionRouterOutlet) {
      ionRouterOutlet.style.display = '';
      document.body.style.background = '';
    }
  }

  async initializeCameraPreview() {
    try {
      this.source = undefined;
      await CameraPreview.stop();
    } catch (error) {
      console.error(error);
    }
    const storyPreview = document.querySelector<HTMLDivElement>('#story-preview');
    this.storyHeight = (document.body.clientWidth / 9) * 16;
    this.cameraPreviewOptions = {
      position: 'rear',
      toBack: true,
      enableZoom: true,
      disableExifHeaderStripping: false,
      height: this.storyHeight,
      width: document.body.clientWidth
    };

    try {
      CameraPreview.start(this.cameraPreviewOptions);
      this.setupForCamera();
      this.cameraInitialize.emit();
    } catch (error) {
      console.error(error);
    }
  }

  async stop() {
    this.source = undefined;
    await CameraPreview.stop();
  }

  async captureImage() {
    const storyPreview = document.querySelector<HTMLDivElement>('#story-preview');
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 100,
      width: document.body.clientWidth,
      height: this.storyHeight,

    };

    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.pictureCreated.emit(result.value);

    this.source = {
      type: 'picture',
      src: result.value,
      usersTags: []
    };
    CameraPreview.stop();
    this.unsetupForCamera();
  }

  flipCamera() {
    CameraPreview.flip();
  }

  toogleTorch() {
    this.torchSetting = this.torchSetting == 'torch' ? 'off' : 'torch';
    CameraPreview.setFlashMode({ flashMode: this.torchSetting });
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
      src: `data:video/mp4;base64,${src}`,
      usersTags: [],
    };
    CameraPreview.stop();
    this.unsetupForCamera();
  }

  private async getVideoUrl(fullPath: string) {
    const path = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    // const fileUriResult = await Filesystem.getUri({
    //   path: path,
    //   directory: Directory.Data
    // });
    const file = await Filesystem.readFile({
      path: path,
      directory: Directory.Cache
    });
    return file.data as string;
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
    const searchTerm = $event.target.value;
    this.usersService.findAll(0, 10, JSON.stringify([
      { email: { $containsIgnore: searchTerm } },
      { firstName: { $containsIgnore: searchTerm } },
      { lastName: { $containsIgnore: searchTerm } },
      { socials: { instagram: { username: { $containsIgnore: searchTerm } } } },
      { socials: { twitter: { username: { $containsIgnore: searchTerm } } } },
      { socials: { facebook: { username: { $containsIgnore: searchTerm } } } },
    ]), undefined, undefined, 'club')
      .subscribe(users => {
        this.users = users.data;
      });
  }

  toggleUser(user: UserBaseDto) {
    if (this.selectedUsers) {
      if (this.selectedUsers.find(u => u.id == user.id)) {
        this.selectedUsers = this.selectedUsers.filter(u => u.id != user.id);
        return;
      }
      this.selectedUsers = [user, ...this.selectedUsers];
    }
  }

  insertUsers() {
    if (this.source?.usersTags) {
      this.source.usersTags = this.selectedUsers;
    }
  }

  isUserSelected(user: UserBaseDto) {
    return !!this.selectedUsers.find(u => u.id == user.id);
  }

}
