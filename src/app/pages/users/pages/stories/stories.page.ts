import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryBaseDto, StoryService } from 'src/app/apis';
import { IonicSlides, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
})
export class StoriesPage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef<HTMLDivElement & { swiper: any; }> | undefined;

  public currentIndex: number = 0;
  public stories?: GetStoryResponseDto[];
  public currentTime: number = 0;
  public currentProgress: number = 0;
  public isCurrentStoryPaused: boolean = false;
  public swiperModules = [IonicSlides];
  public filter: any = {};
  public intervalIds: any[] = [];

  constructor(
    private storiesService: StoryService,
    private route: ActivatedRoute,
    public authManager: AuthManagerService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {

    this.route.queryParams.subscribe(res => {
      if (res['filter']) {
        const filter = JSON.parse(res['filter']);
        this.findStories(filter);
      }
    });
    if (!this.route.snapshot.queryParams['filter']) {
      this.findStories(this.filter);
    }
  }

  async ionViewWillLeave() {
    for (let video of Array.from(document.querySelectorAll<HTMLVideoElement>('swiper-slide video'))) {
      video.currentTime = 0;
      await video.pause();
    }
  }


  findStories(filter: any) {
    this.storiesService.findAll(
      0,
      20,
      JSON.stringify(filter),
      undefined,
      undefined,
      'party.club'
    ).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe(res => {
      this.stories = res.data;
      setTimeout(() => {
        this.initSwiper();
        this.initStory();
      }, 500);
    });
  }

  initSwiper() {
    document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper.update();

    const swiperEl = document.querySelector<HTMLDivElement>('#stories-slider');
    swiperEl?.addEventListener('durationchange', (event: any) => {
      console.log("Duration:", event);
    });
    swiperEl?.addEventListener('slidechange', (event: any) => {
      this.currentProgress = 0;
      this.currentIndex = event.detail[0].realIndex;

      const promises = [];
      for (let video of Array.from(document.querySelectorAll<HTMLVideoElement>('swiper-slide video'))) {
        video.currentTime = 0;
        promises.push(video.pause());
      }

      Promise.all(promises).then(res => {
        this.initStory();
      });
    });
    return swiperEl;
  }

  prev() {
    const swiper = document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper;
    if (swiper.activeIndex > 0) {
      for (let intervalID of this.intervalIds) {
        clearInterval(intervalID);
      }
      swiper.slidePrev();
    }
  }

  next() {
    const swiper = document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper;
    if (swiper.activeIndex < this.stories!.length - 1) {
      for (let intervalID of this.intervalIds) {
        clearInterval(intervalID);
      }
      swiper.slideNext();
    }
  }

  pause() {
    this.isCurrentStoryPaused = true;
    for (let video of Array.from(document.querySelectorAll<HTMLVideoElement>('swiper-slide video'))) {
      video.pause();
    }
  }

  resume() {
    this.isCurrentStoryPaused = false;
    for (let video of Array.from(document.querySelectorAll<HTMLVideoElement>('swiper-slide video'))) {
      video.play();
    }
  }

  initStory() {
    const swiper: { slides: HTMLDivElement[]; slideNext: () => {}; } = document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper;
    const video = swiper.slides[this.currentIndex].querySelector<HTMLVideoElement>('video');

    this.currentTime = 0;

    if (video) {
      const intervalID = setInterval(() => {
        this.currentTime = video.currentTime;
        if (this.currentTime > 0) {
          this.currentProgress = this.currentTime / video.duration;
          if (this.currentProgress >= 1) {
            if (this.currentIndex + 1 == this.stories?.length) {
              this.modalCtrl.dismiss();
            }
            document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper.slideNext();
            clearInterval(intervalID);
          }
        }
      }, 200);
      this.intervalIds.push(intervalID);
      video.play();
      return;
    }

    const intervalID = setInterval(() => {
      if (this.currentTime > 0) {
        this.currentProgress = this.currentTime / 15000;
        if (this.currentProgress >= 1) {
          if (this.currentIndex + 1 == this.stories?.length) {
            this.modalCtrl.dismiss();
          }
          document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper.slideNext();
          clearInterval(intervalID);
        }
      }
      this.intervalIds.push(intervalID);
      if (!this.isCurrentStoryPaused) this.currentTime += 200;
    }, 200);

  }

  getClubName(story: GetStoryResponseDto) {
    return story.party.club.name || (<any>story.party).customData?.club;
  }

  deleteStory(id: number) {
    this.storiesService._delete(id).subscribe(() => {
      this.findStories(this.filter);
    });
  }

  isImage(story: GetStoryResponseDto) {
    return story.attachment.mimeType.startsWith('image');
  }

  previousUser() {
    this.modalCtrl.dismiss({}, 'PREVIOUS_USER');
  }

  nextUser() {
    this.modalCtrl.dismiss({}, 'NEXT_USER');
  }
}
