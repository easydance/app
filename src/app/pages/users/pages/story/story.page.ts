import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { CaptureImageOptions, MediaCapture, MediaFile } from '@awesome-cordova-plugins/media-capture/ngx';
import { CapacitorVideoPlayer } from 'capacitor-video-player';

@Component({
  selector: 'story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {

  @ViewChild('video') captureElement?: ElementRef;
  public isRecording: boolean = false;
  public capturedVideo?: MediaFile;
  nativeUrl?: string;

  constructor(private mediaCapture: MediaCapture, public fileService: File) { }

  async ngOnInit() {
  }

  async recordVideo() {
    try {
      let options: CaptureImageOptions = { limit: 1 };
      const data = await this.mediaCapture.captureVideo(options);
      console.log(data);
      if (Array.isArray(data)) {
        this.capturedVideo = data[0];
        const a = await this.fileService.resolveLocalFilesystemUrl(this.capturedVideo.fullPath)
        // const reader = new FileReader();
        // reader.readAsDataURL() as any)
        // reader.onloadend = async (evt: any) => {
        //   debugger;
        // };
        // let dir = this.capturedVideo.localURL.split('/');
        // dir.pop();
        // const fromDir = dir.join('/');
        // const toDir = this.fileService.dataDirectory;
        // const response = await this.fileService.copyFile(fromDir, this.capturedVideo.name, toDir, this.capturedVideo.name);
        // console.log(response);
        // let path = this.fileService.dataDirectory + this.capturedVideo.name;
        // await CapacitorVideoPlayer.initPlayer({
        //   mode: 'fullscreen',
        //   url: path,
        //   playerId: 'fullscreen',
        //   componentTag: 'app-home'
        // }); 
        this.nativeUrl = a.nativeURL;
        const u = a.toURL();  
        const u1 = a.toInternalURL();  
        console.log('ok')
      } else {
        console.log("Capture error:", data);
      }
    } catch (error) {
      console.error(error);
    }
    if (this.captureElement) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        },
        audio: true
      });
      this.captureElement.nativeElement.srcObject = stream;
    }
  }

  // async getNativeUrl() {
  //   // let dir = this.capturedVideo.localURL.split('/');
  //   // dir.pop();
  //   // const fromDir = dir.join('/');
  //   // const file = await this.fileService.getFile(fromDir, this.capturedVideo.name, { create: false });
  //   // debugger
  //   return file.nativeURL;
  // }

}
