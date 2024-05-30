import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { DateTime } from 'luxon';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryService, UserBaseDto } from 'src/app/apis';
import { StoryComponent } from 'src/app/pages/users/pages/stories-v2/components/story/story.component';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { StoryController } from 'src/app/services/story.controller';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'stories-v2',
  templateUrl: './stories-v2.page.html',
  styleUrls: ['./stories-v2.page.scss'],
})
export class StoriesV2Page implements OnInit {

  @ViewChild('storiesSwiper') storiesSwiper?: ElementRef<SwiperContainer>;
  @ViewChildren(StoryComponent) storyComponents?: QueryList<StoryComponent>;

  @Input() defaultFilter: { [key: string]: any; } = {
    createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() }
  };

  firstUser?: number;

  stories: GetStoryResponseDto[] = [];
  usersStories: { user: UserBaseDto, stories: GetStoryResponseDto[]; }[] = [];

  effect: string = this.platform.is('ios') ? '' : 'cube';
  isLastSlide: boolean = false;

  constructor(
    private storiesCtrl: StoryController,
    private storiesService: StoryService,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private authManager: AuthManagerService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.firstUser = res['firstUser'];
      const filter = {
        ...this.defaultFilter,
        ...(res['userId'] ? { user: { id: res['userId'] } } : {}),
        ...(!res['userId'] ? { user: { id: { $in: (this.storiesCtrl.users?.map(u => u.id) || []) } } } : {})
      };

      this.storiesService.findAll(
        0,
        50,
        JSON.stringify(filter),
        undefined,
        undefined,
        'party.club,user,userTags'
      ).pipe(
        catchError(err => {
          return throwError(() => err);
        })
      ).subscribe(res => {
        this.stories = res.data;
        const usersStories: { user: UserBaseDto, stories: GetStoryResponseDto[]; }[] = [];
        for (let story of this.stories) {
          const userStories = usersStories.find(us => us.user.id == story.user?.id);
          if (userStories) {
            userStories.stories.push(story);
            continue;
          }
          usersStories.push({
            stories: [story],
            user: story.user!
          });
        }
        if (this.firstUser) {
          const firstUserStory = usersStories.find(us => us.user.id == this.firstUser);
          const myStories = usersStories.find(us => us.user.id == (this.authManager.user?.id || 'NO-ID') && (this.authManager.user?.id || 'NO-ID').toString() != (this.firstUser || 'NO-ID'));
          const otherStories = usersStories.filter(us => ![
            (this.firstUser || 'NO-ID'),
            (this.authManager.user?.id || 'NO-ID').toString()
          ].includes((us.user.id || 'NO-ID').toString()));
          this.usersStories = [
            ...(firstUserStory ? [firstUserStory] : []),
            ...(otherStories ?? []),
            ...(myStories ? [myStories] : []),
          ];
        } else {
          this.usersStories = usersStories;
        }

        this.initSwiper();
      });
    });
  }

  ngAfterViewInit() {
    this.storyComponents?.changes.subscribe(res => {
      this.storyComponents?.first.ready.subscribe(self => {
        self.start();
      });

      for (const storyComponent of this.storyComponents!.toArray()) {
        storyComponent.ready.subscribe(() => {
          storyComponent.onClose.subscribe(() => {
            this.navCtrl.back();
          });
          storyComponent.storiesOverview!.onStoriesEnd.subscribe(res => {
            if (res.action == 'next') {
              this.storiesSwiper?.nativeElement.swiper.slideNext();
              if (this.storiesSwiper?.nativeElement.swiper.isEnd) {
                if (this.isLastSlide) {
                  this.navCtrl.back();
                } else {
                  this.isLastSlide = true;
                }
              }
            }
            if (res.action == 'prev') {
              this.storiesSwiper?.nativeElement.swiper.slidePrev();
              this.isLastSlide = false;
            }
          });
        });
      }
    });
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    for (const storyComponent of this.storyComponents?.toArray() || []) {
      storyComponent.reset();
    }
  }

  initSwiper() {
    const swiperEl = document.querySelector<SwiperContainer>("#stories");
    // swiperEl!.initialize();
    swiperEl?.swiper.on('slideChange', () => {
      console.log('slide changed', swiperEl?.swiper.activeIndex);
      if (swiperEl && this.storyComponents) {
        for (const overview of this.storyComponents) {
          overview.pause();
        }
        const currentStoriesOverview = this.storyComponents.toArray()[swiperEl.swiper.activeIndex];
        currentStoriesOverview.start();
      }

    });
    setTimeout(() => {
      swiperEl?.swiper.update();
    }, 100);
  }

  getFilter(el: { user: UserBaseDto, stories: GetStoryResponseDto[]; }) {
    return {
      ...this.defaultFilter,
      user: { id: (el.user.id || 'NO-ID') },
    };
  }

}
