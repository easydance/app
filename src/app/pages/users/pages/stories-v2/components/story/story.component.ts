import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { IonContent, IonicSlides, ModalController, NavController, IonModal, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryService, StoryLikeService, StoryBaseDto, UserBaseDto, ClubBaseDto, PartyBaseDto } from 'src/app/apis';
import { UiModule } from 'src/app/components/ui.module';
import { ShorterNumberPipe } from 'src/app/pipes/shorter-number.pipe';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { StoryController } from 'src/app/services/story.service';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, UiModule, ShorterNumberPipe]
})
export class StoryComponent implements OnChanges {
  @ViewChild('swiper') swiperRef: ElementRef<SwiperContainer> | undefined;

  @Input() stories?: GetStoryResponseDto[];
  @Input() filter?: any;
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Output() ready: EventEmitter<StoryComponent> = new EventEmitter();

  public id: string = Math.random().toString(32).split('.').pop()!;
  public storiesOverview?: StoriesOverview;


  constructor(
    private storiesService: StoryService,
    public authManager: AuthManagerService,
    private storyLikeService: StoryLikeService,
    private navCtrl: NavController,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'].firstChange) {
      this.findStories(changes['filter'].currentValue);
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
      this.storiesOverview = new StoriesOverview(res.data);
      this.storiesOverview.onStoryEnd.subscribe(overview => {
        if (this.swiperRef && this.storiesOverview) {
          this.swiperRef.nativeElement.swiper?.slideTo(this.storiesOverview.currentIndex);
        }
      });
      this.swiperRef?.nativeElement.swiper.update();
      this.ready.emit(this);
    });
  }

  getClubName(story: GetStoryResponseDto) {
    return story.party.club.name || (<any>story.party).customData?.club;
  }

  start(n?: number) {
    this.storiesOverview?.goTo(n || 0);
  }

  pause() {
    this.storiesOverview?.pause();
  }

  reset() {

  }

  close() {
    this.onClose.emit();
  }

  next() {
    this.storiesOverview?.next();
  }

  prev() {
    this.storiesOverview?.prev();
  }

  deleteStory(id: number) {
    this.storiesService._delete(Number(id.toString().replace('story-', ''))).subscribe(() => {
      this.findStories(this.filter);
    });
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
    this.storiesOverview?.pause();
    modal.present();
    modal.onDidDismiss().then(res => {
      this.storiesOverview?.start();
    });

  }

  async openUserProfile(user: UserBaseDto) {
    this.storiesOverview?.pause();
    this.navCtrl.navigateForward('/profile/' + user.id);
  }

  async openClubDetails(club: ClubBaseDto) {
    this.storiesOverview?.pause();
    this.navCtrl.navigateForward('/club-detail/' + club.id);
  }

  async openPartyDetails(party: PartyBaseDto) {
    this.storiesOverview?.pause();
    this.navCtrl.navigateForward('/event-detail/' + party.id);
  }

}

class StoriesOverview {

  public onStoryEnd: EventEmitter<StoryOverview> = new EventEmitter();
  public onStoriesEnd: EventEmitter<{ overview: StoriesOverview, action: 'prev' | 'next'; }> = new EventEmitter();

  public get stories() {
    return this._stories;
  }
  public get currentIndex() {
    return this._currentIndex;
  }
  public get currentProgress() {
    return this.current.currentTime / this.current.duration;
  }
  public get current() {
    return this._stories[this._currentIndex];
  }

  private _currentIndex: number = 0;
  private _stories: StoryOverview[];

  constructor(stories: GetStoryResponseDto[]) {
    this._stories = stories.map(story => new StoryOverview(story));
    for (const story of this._stories) {
      story.onEnd.subscribe(() => {
        this.next();
        this.onStoryEnd.emit(story);
      });
    }
  }

  prev() {
    if (this._currentIndex - 1 >= 0) {
      this.goTo(this._currentIndex - 1);
      return;
    }
    this.onStoriesEnd.emit({ overview: this, action: 'prev' });
    this.reset();
  }

  next() {
    if (this._currentIndex + 1 <= this._stories.length - 1) {
      this.goTo(this._currentIndex + 1);
      return;
    }
    this.onStoriesEnd.emit({ overview: this, action: 'next' });
    this.reset();
  }

  goTo(n: number) {
    for (const story of this._stories) {
      story.pause();
    }
    const storyOverview = this._stories[n];
    if (storyOverview) {
      storyOverview.restart();
      this._currentIndex = n;
    }
  }

  pause() {
    this.pauseAll();
  }

  pauseAll() {
    for (const story of this._stories) {
      story.pause();
    }
  }

  restart() {
    this.current.restart();
  }

  reset() {
    this._currentIndex = 0;
    for (let s of this._stories) {
      s.reset();
    }
  }

  start() {
    this.current.start();
  }

}

class StoryOverview {

  public onEnd: EventEmitter<void> = new EventEmitter();

  public get story() {
    return this._story;
  }
  public get duration() {
    return this._duration;
  }
  public get active() {
    return this._active;
  }
  public get isImage() {
    return this.getIsImage();
  }
  public get currentTime() {
    return this._currentTime;
  }

  private _currentTime: number = 0;
  private _story: GetStoryResponseDto;
  private _duration: number = 15;
  private _active: boolean = false;
  private _intervalId: any = undefined;

  constructor(story: GetStoryResponseDto) {
    this._story = story;
    this._duration = this.calcDuration();
    this._active = false;
  }

  public start() {
    this._active = true;
    this._intervalId = setInterval(() => {
      this._currentTime += 100;
      if (this.duration < this.currentTime) {
        this.pause();
        this.onEnd.emit();
      }
    }, 100);
  }

  public pause() {
    clearInterval(this._intervalId);
  }

  reset() {
    this._active = false;
    this._currentTime = 0;
  }

  public restart() {
    this._currentTime = 0;
    this.start();
  }

  private getIsImage() {
    return this.story.attachment.mimeType.startsWith('image');
  }

  private calcDuration() {
    if (this.isImage) {
      return 15000;
    }
    const video = document.querySelector('#story-' + this.story.id)?.querySelector('video');
    if (video) {
      return video.duration * 1000;
    }
    return 0;
  }
}
