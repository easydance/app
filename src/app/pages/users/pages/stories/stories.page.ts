import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryService } from 'src/app/apis';
import { IonicSlides } from '@ionic/angular';
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
  public currentProgress: number = 0;
  public swiperModules = [IonicSlides];

  constructor(private storiesService: StoryService, private route: ActivatedRoute, public authManager: AuthManagerService) { }

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
      this.findStories({});
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
        this.startVideo(this.stories?.[0]);
      }, 500);
    });
  }

  initSwiper() {
    this.swiperRef?.nativeElement?.swiper.update();

    const swiperEl = document.querySelector<HTMLDivElement>('swiper-container');
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
        this.startVideo();
      });
    });
  }

  startVideo(story?: GetStoryResponseDto) {
    const swiper: { slides: HTMLDivElement[]; } = this.swiperRef?.nativeElement?.swiper;
    const video = swiper.slides[this.currentIndex].querySelector<HTMLVideoElement>('video');
    if (video) {
      const intervalID = setInterval(() => {
        if (video.currentTime > 0) {
          this.currentProgress = video.currentTime / video.duration;
          if (this.currentProgress >= 1) {
            this.swiperRef?.nativeElement.swiper.slideNext();
            clearInterval(intervalID);
          }
        }
      }, 200);
      video.play();
      this.storiesService.findOne(story?.id || swiper.slides[this.currentIndex].id).subscribe(res => { });
    } else if (story && this.isImage(story)) {
      this.currentProgress = 0;
      const intervalID = setInterval(() => {
        this.currentProgress = this.currentProgress + 200 / 15000;
        if (this.currentProgress >= 1) {
          this.swiperRef?.nativeElement.swiper.slideNext();
          clearInterval(intervalID);
        }
      }, 200);
      this.storiesService.findOne(story.id || swiper.slides[this.currentIndex].id).subscribe(res => { });
    }
  }

  getClubName(story: GetStoryResponseDto) {
    return story.party.club.name || (<any>story.party).customData?.club;
  }

  deleteStory(id: number) {
    this.storiesService._delete(id).subscribe(() => {
      this.findStories({});
    });
  }

  isImage(story: GetStoryResponseDto) {
    return story.attachment.mimeType.startsWith('image');
  }
}
