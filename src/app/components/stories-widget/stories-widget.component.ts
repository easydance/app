import { KeyValuePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryBaseDto, StoryService, UserBaseDto } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { SwiperContainer } from 'swiper/element';


@Component({
  selector: 'stories-widget',
  templateUrl: './stories-widget.component.html',
  styleUrls: ['./stories-widget.component.scss'],
})
export class StoriesWidgetComponent implements OnInit {

  @ViewChild('swiper') swiper?: SwiperContainer;

  stories: GetStoryResponseDto[] = [];
  users: { [id: string]: { user: UserBaseDto, stories: GetStoryResponseDto[]; }; } = {};

  public userKeyValue = Object.keys(this.users).map(key => ({ key, value: this.users[key] }));

  @Output() userClick: EventEmitter<{ user: UserBaseDto, stories: GetStoryResponseDto[]; }> = new EventEmitter();
  @Output() storyClick: EventEmitter<GetStoryResponseDto[]> = new EventEmitter();
  @Output() meClick: EventEmitter<void> = new EventEmitter();
  @Output() newStory: EventEmitter<void> = new EventEmitter();

  constructor(private storiesService: StoryService, public authManager: AuthManagerService, private detector: ChangeDetectorRef) { }

  ngOnInit() {
    this.findStories({ createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() } });
  }

  findStories(filter: any = {}) {
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
      for (let story of this.stories) {
        if (!this.users[story.user?.id || '']) {
          this.users[story.user?.id || ''] = {
            user: story.user!,
            stories: []
          };
        }
        this.users[story.user?.id || ''].stories.push(story);
      }
      this.userKeyValue = Object.keys(this.users).map(key => ({ key, value: this.users[key] }));
      this.detector.detectChanges();
    });
  }

  onMe() {
    if (this.users[this.authManager.user?.id || '']) {
      this.storyClick.emit(this.users[this.authManager.user?.id || ''].stories);
      return;
    }
    this.meClick.emit();
  }

  onAvatarClick($event: { user: UserBaseDto, stories: GetStoryResponseDto[]; }) {
    this.storyClick.emit($event.stories);
    this.userClick.emit($event);
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
