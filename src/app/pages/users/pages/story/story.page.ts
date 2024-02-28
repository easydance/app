import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController, NavController } from '@ionic/angular';
import { AttachmentService, StoryService } from 'src/app/apis';
import { RecordingVideoPreviewComponent, StorySource } from 'src/app/pages/users/pages/story/components/recording-video-preview/recording-video-preview.component';
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

  constructor(
    private navCtrl: NavController,
    private storiesService: StoryService,
    private attachmentService: AttachmentHelperService,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.recordingVideoPreview?.initializeCameraPreview();
    }, 500);
  }

  ionViewWillLeave() {
    this.recordingVideoPreview?.stop();
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
      message: "Salvataggio...",
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
          this.storyModal?.present();
          loading.dismiss();
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

}
