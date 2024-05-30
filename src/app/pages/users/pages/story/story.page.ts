import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AttachmentService, StoryService } from 'src/app/apis';
import { RecordingVideoPreviewComponent, StorySource } from 'src/app/pages/users/pages/story/components/recording-video-preview/recording-video-preview.component';
import { StoryController } from 'src/app/services/story.controller';
import { AttachmentHelperService } from 'src/app/services/upload.service';

@Component({
  selector: 'story-page',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {

  @ViewChild('storyModal') storyModal?: IonModal;
  @ViewChild('recordingVideoPreview') recordingVideoPreview?: RecordingVideoPreviewComponent;

  storySource?: StorySource;
  isReady: boolean = false;
  cameraReady: boolean = false;
  completed: boolean = false;

  constructor(
    private navCtrl: NavController,
    private storiesCtrl: StoryController,
    private storiesService: StoryService,
    private attachmentService: AttachmentHelperService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
  }

  ionViewWillEnter() {
    this.isReady = true;
    // setTimeout(() => {
    //   this.recordingVideoPreview?.initializeCameraPreview()
    // }, 500);
  }

  ionViewWillLeave() {
    // this.recordingVideoPreview?.stop();
    this.isReady = false;
    // this.cameraReady = false;
  }

  mediaCreated(source: StorySource) {
    this.storySource = source;
    this.saveStory();
  }

  goBack() {
    this.navCtrl.back();
  }

  async saveStory() {

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('APP.SAVING'),
      translucent: true
    });
    loading.present();

    if (!this.storySource) {
      loading.dismiss();
      return;
    }

    this.storiesService.create({
      hidden: false,
      party: this.storySource.party?.id,
      title: '',
      userTags: this.storySource.usersTags.map(ut => ut.id)
    } as any).subscribe(res => {
      const file = this.dataURLtoFile(
        `data:${this.storySource?.type == 'picture' ? 'image/jpeg' : 'video/mp4'};base64,${this.storySource?.src}`,
        `story-${res.data.id}.${this.storySource?.type == 'picture' ? 'jpg' : 'mp4'}`
      )!;
      this.attachmentService.upload(res.data.id!, 'STORY' as any, file)
        .subscribe(storyAtt => {
          this.isReady = false;
          // this.storyModal?.present();
          this.completed = true;
          loading.dismiss();
          this.storiesCtrl.storiesChanged.emit();
        });
    });

  }

  dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    if (arr.length > 1) {
      let mime = arr[0].match(/:(.*?);/)?.[1];
      let bstr = atob(arr[arr.length - 1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    return undefined;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
