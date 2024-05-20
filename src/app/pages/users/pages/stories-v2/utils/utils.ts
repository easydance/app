import { EventEmitter } from "@angular/core";
import { GetStoryResponseDto } from "src/app/apis";

export class StoriesOverview {

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
    }

    next() {
        if (this._currentIndex + 1 <= this._stories.length - 1) {
            this.goTo(this._currentIndex + 1);
            return;
        }
        this.onStoriesEnd.emit({ overview: this, action: 'next' });
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

export class StoryOverview {

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
