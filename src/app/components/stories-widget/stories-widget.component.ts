import { KeyValuePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryBaseDto, StoryService, UserBaseDto } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { StoryController } from 'src/app/services/story.controller';
import { SwiperContainer } from 'swiper/element';


@Component({
  selector: 'stories-widget',
  templateUrl: './stories-widget.component.html',
  styleUrls: ['./stories-widget.component.scss'],
})
export class StoriesWidgetComponent implements OnInit {

  @ViewChild('swiper') swiper?: SwiperContainer;

  users: { [id: string]: { user: UserBaseDto, stories: StoryBaseDto[]; }; } = {};

  public get userKeyValue() {
    return Object.keys(this.users).filter(id => {
      console.log(parseInt(id), ' !== ', (this.authManager.user?.id || ''), ' => ', parseInt(id) !== (this.authManager.user?.id || ''));
      return parseInt(id) !== (this.authManager.user?.id || '');
    }).map(key => ({ key, value: this.users[key] }));
  }

  @Output() userClick: EventEmitter<{ user: UserBaseDto, stories: StoryBaseDto[]; }> = new EventEmitter();
  @Output() storyClick: EventEmitter<StoryBaseDto[]> = new EventEmitter();
  @Output() meClick: EventEmitter<void> = new EventEmitter();
  @Output() newStory: EventEmitter<void> = new EventEmitter();

  constructor(
    private storiesCtrl: StoryController,
    public authManager: AuthManagerService,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authManager.user$.subscribe(res => {
      this.findStories({ createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() } });
    });

    this.storiesCtrl.storiesChanged.subscribe(() => {
      this.findStories({ createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() } });
    });
  }

  findStories(filter: any = {}) {
    this.storiesCtrl.getFollowed(filter).subscribe(res => {
      this.users = {};
      for (const user of res.data) {
        if (!user.stories?.length) {
          continue;
        }
        if (!this.users[user?.id || '']) {
          this.users[user?.id || ''] = {
            user,
            stories: []
          };
        }
        this.users[user?.id || ''].stories.push(...(user?.stories || []));
      }
      this.detector.detectChanges();
      this.swiper?.swiper?.update();
    });
  }

  onMe() {
    if (this.users[this.authManager.user?.id || '']) {
      this.storyClick.emit(this.users[this.authManager.user?.id || ''].stories);
      return;
    }
    this.meClick.emit();
  }

  onAvatarClick($event: { user: UserBaseDto, stories: StoryBaseDto[]; }) {
    this.storyClick.emit($event.stories);
    this.userClick.emit($event);
  }

  onMeClick() {
    if (this.users[this.authManager.user?.id!].stories.length == 0) {
      this.newStory.emit();
      return;
    }
    this.storyClick.emit(this.users[this.authManager.user?.id!].stories);
    this.userClick.emit(this.authManager.user as any);
  }

  getNext(user: UserBaseDto) {
    const index = this.userKeyValue.findIndex(u => u.value.user.id == user.id);
    return this.userKeyValue[index + 1];
  }

  getPrev(user: UserBaseDto) {
    const index = this.userKeyValue.findIndex(u => u.value.user.id == user.id);
    if (index == 0) {
      return undefined;
    }
    return this.userKeyValue[index - 1];
  }

}
