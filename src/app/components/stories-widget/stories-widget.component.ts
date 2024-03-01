import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GetStoryResponseDto, StoryBaseDto, StoryService, UserBaseDto } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'stories-widget',
  templateUrl: './stories-widget.component.html',
  styleUrls: ['./stories-widget.component.scss'],
})
export class StoriesWidgetComponent implements OnInit {
  stories: GetStoryResponseDto[] = [];
  users: { [id: string]: { user: UserBaseDto, stories: GetStoryResponseDto[]; }; } = {};

  @Output() userClick: EventEmitter<{ user: UserBaseDto, stories: GetStoryResponseDto[]; }> = new EventEmitter();
  @Output() storyClick: EventEmitter<GetStoryResponseDto[]> = new EventEmitter();
  @Output() meClick: EventEmitter<void> = new EventEmitter();
  @Output() newStory: EventEmitter<void> = new EventEmitter();

  constructor(private storiesService: StoryService, public authManager: AuthManagerService) { }

  ngOnInit() {
    this.findStories({});
  }

  findStories(filter: any = {}) {
    this.storiesService.findAll(
      0,
      50,
      JSON.stringify(filter),
      undefined,
      undefined,
      'party.club,user'
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
    });
  }

  onMe() {
    if (this.users[this.authManager.user?.id || '']) {
      this.storyClick.emit(this.users[this.authManager.user?.id || ''].stories);
      return;
    }
    this.meClick.emit();
  }

}
