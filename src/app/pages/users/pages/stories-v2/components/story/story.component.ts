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
import { StoriesOverview } from 'src/app/pages/users/pages/stories-v2/utils/utils';
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
    this.swiperRef?.nativeElement.swiper.slideTo(0);
  }

  close() {
    this.onClose.emit();
  }

  next() {
    this.swiperRef?.nativeElement.swiper.updateSlides();
    this.swiperRef?.nativeElement.swiper.slideNext();
    this.storiesOverview?.next();
  }

  prev() {
    this.swiperRef?.nativeElement.swiper.updateSlides();
    this.swiperRef?.nativeElement.swiper.slidePrev();
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
