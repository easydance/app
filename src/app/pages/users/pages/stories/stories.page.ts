import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ClubBaseDto, GetStoryResponseDto, PartyBaseDto, StoryBaseDto, StoryLikeService, StoryService, UserBaseDto } from 'src/app/apis';
import { GestureController, IonContent, IonModal, IonNav, IonicSlides, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { ProfilePage } from 'src/app/pages/users/pages/profile/profile.page';
import { ClubDetailPage } from 'src/app/pages/users/pages/club-detail/club-detail.page';
import { Share } from '@capacitor/share';
import { StoryController } from 'src/app/services/story.service';


@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
})
export class StoriesPage implements OnInit {

  @ViewChild('swiper') swiperRef: ElementRef<HTMLDivElement & { swiper: any; }> | undefined;
  @ViewChild(IonContent, { read: ElementRef }) content?: ElementRef<HTMLIonContentElement>;

  @Input() options: { type: 'modal' | 'page'; } = { type: 'modal' };

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
    private modalCtrl: ModalController,
    private storyLikeService: StoryLikeService,
    private navCtrl: NavController,
    private storyCtrl: StoryController
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      if (res['filter']) {
        const filter = JSON.parse(res['filter']);
        this.findStories(filter);
      }
      if (res['type']) {
        this.options.type = res['type'];
      }
    });
  }

  ionViewWillEnter() {
    this.resume();
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
      'party.club,userTags,user'
    ).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe(res => {
      this.stories = res.data;
      if (this.stories.length === 0) {
        this.close();
        return;
      }
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

      for (let video of Array.from(document.querySelectorAll<HTMLVideoElement>('swiper-slide video'))) {
        video.currentTime = 0;
        video.pause();
      }
      this.initStory();
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
    const swiper = this.swiperRef?.nativeElement.swiper;
    let index_currentSlide = swiper.realIndex;
    let currentSlide = swiper.slides[index_currentSlide];
    currentSlide.querySelector('video')?.play();
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
              this.close();
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
            this.close();
          }
          document.querySelector<HTMLDivElement & { swiper: any; }>('#stories-slider')?.swiper.slideNext();
          clearInterval(intervalID);
        }
      }
      this.intervalIds.push(intervalID);
      if (!this.isCurrentStoryPaused) this.currentTime += 200;
    }, 200);

  }

  deleteStory(id: number) {
    this.storiesService._delete(id).subscribe(() => {
      this.findStories(this.filter);
    });
  }

  isImage(story: GetStoryResponseDto) {
    return story.attachment.mimeType.startsWith('image');
  }

  getClubName(story: GetStoryResponseDto) {
    return story.party.club.name || (<any>story.party).customData?.club;
  }

  async close(data?: any, role?: string) {
    for (let interval of this.intervalIds) {
      clearInterval(interval);
    }
    this.modalCtrl.dismiss(data, role);
    if (this.options.type == 'page') {
      await this.navCtrl.back();
      // this.storyCtrl.onStoryClose.emit(role);
    }
  }

  toggleLike(story: GetStoryResponseDto) {
    this.storyLikeService.set({
      story: { id: story.id } as any,
    }).subscribe(res => {
      story.liked = !story.liked;
      if (story.liked) {
        story.likes += 1;
      } else {
        story.likes -= 1;
      }
    });
  }

  share(story: StoryBaseDto) {
    Share.share({
      title: '',
      text: '',
      url: 'https://easydance.app/?story=' + story?.id,
      dialogTitle: 'Condividi questa story con i tuoi amici',
    });
  }

  openUserTagged(modal: IonModal) {
    this.pause();
    modal.present();
    modal.onDidDismiss().then(res => {
      this.resume();
    });

  }

  async openUserProfile(user: UserBaseDto) {
    this.pause();
    this.navCtrl.navigateForward('/profile/' + user.id);
  }

  async openClubDetails(club: ClubBaseDto) {
    this.pause();
    this.navCtrl.navigateForward('/club-detail/' + club.id);
  }

  async openPartyDetails(party: PartyBaseDto) {
    this.pause();
    this.navCtrl.navigateForward('/event-detail/' + party.id);
  }

  // private startProgress(story: GetStoryResponseDto) {
  //   const duration = this.calcDuration(story);
  // }

  // private calcDuration(story: GetStoryResponseDto) {
  //   if (this.isImage(story)) {
  //     return 15;
  //   }
  //   const video = document.querySelector('#story-' + story.id)?.querySelector('video');
  //   if (video) {
  //     return video.duration;
  //   }
  //   return 0;
  // }

}
