import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[swipe]',
  standalone: true
})
export class SwipeDirective {

  @Input() options?: { graceDelta?: number, actionDelta?: number; };

  @Output() swipeUp: EventEmitter<void> = new EventEmitter();
  @Output() swipeDown: EventEmitter<void> = new EventEmitter();
  @Output() swipeLeft: EventEmitter<void> = new EventEmitter();
  @Output() swipeRight: EventEmitter<void> = new EventEmitter();

  private start: { x: number, y: number; } = { x: 0, y: 0 };

  constructor(private el: ElementRef<HTMLElement>) {
    el.nativeElement.addEventListener('touchstart', this.initSwipe.bind(this));
    el.nativeElement.addEventListener('touchend', this.endSwipe.bind(this));
  }

  initSwipe($event: TouchEvent) {
    this.start = {
      x: $event.targetTouches[0].clientX,
      y: $event.targetTouches[0].clientY
    };
  }

  endSwipe($event: TouchEvent) {
    console.log($event);
    const changed = {
      x: $event.changedTouches[0].clientX,
      y: $event.changedTouches[0].clientY
    };

    const graceDelta = this.options?.graceDelta || 100;
    const actionDelta = this.options?.actionDelta || 100;

    if (Math.abs(changed.x - this.start.x) < graceDelta && changed.y - this.start.y > actionDelta) {
      this.swipeDown.emit();
    }
    if (Math.abs(changed.x - this.start.x) < graceDelta && changed.y - this.start.y < (actionDelta * -1)) {
      this.swipeUp.emit();
    }
    if (Math.abs(changed.y - this.start.y) < graceDelta && changed.x - this.start.x < (actionDelta * -1)) {
      this.swipeRight.emit();
    }
    if (Math.abs(changed.y - this.start.y) < graceDelta && changed.x - this.start.x > actionDelta) {
      this.swipeLeft.emit();
    }
    this.start = { x: 0, y: 0 };
  }
}
