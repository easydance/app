import { EventEmitter, Injectable } from '@angular/core';
import { AnimationController, ModalController, NavController, createAnimation } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { StoryBaseDto, UserBaseDto } from 'src/app/apis';
import { StoriesPage } from 'src/app/pages/users/pages/stories/stories.page';
import { StoryPage } from 'src/app/pages/users/pages/story/story.page';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StoryController {

  // private userStore = new BehaviorSubject<string | undefined>(undefined);
  // public user$ = this.userStore.asObservable();

  public nextUser: EventEmitter<{ currentUserId: number; }> = new EventEmitter();
  public previousUser: EventEmitter<{ currentUserId: number; }> = new EventEmitter();

  constructor(
    private authManager: AuthManagerService,
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private modalCtrl: ModalController
  ) { }

  async makeStory() {
    if (this.authManager.isAuthenticated()) {
      // this.navCtrl.navigateBack('/story');
      const storiesModal = await this.modalCtrl.create({
        component: StoryPage,
        componentProps: {},
        backdropDismiss: true,
        breakpoints: [0, 1],
        cssClass: ['default-transparent']
      });
      await storiesModal.present();
      storiesModal.onWillDismiss().then(data => {

      });
      return;
    }
  }

  async openUserStoriesModal(current: { user: UserBaseDto; }) {
    const storiesModal = await this.modalCtrl.create({
      component: StoriesPage,
      componentProps: {
        filter: { user: { id: current.user.id } }
      },
      backdropDismiss: true,
      breakpoints: [0, 1],
      enterAnimation: this.storyEnterAnimation.bind(this),
      leaveAnimation: this.storyLeaveAnimation.bind(this)
    });
    storiesModal.present();

    return storiesModal;
  }

  storyEnterAnimation(baseEl: HTMLElement) {
    const root = baseEl.shadowRoot!;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(150)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  storyLeaveAnimation(baseEl: HTMLElement) {
    return this.storyEnterAnimation(baseEl).direction('reverse');
  }


  pageCubicEnterAnimation(baseEl: HTMLElement, opts: TransitionOptions) {
    const DURATION = 300;

    // root animation with common setup for the whole transition
    const rootTransition = createAnimation()
      .duration(opts.duration || DURATION)
      .easing('cubic-bezier(0.3,0,0.66,1)');

    // ensure that the entering page is visible from the start of the transition
    const enteringPage = createAnimation()
      .addElement(getIonPageElement(opts.enteringEl))
      .beforeRemoveClass('ion-page-invisible');

    // create animation for the leaving page
    const leavingPage = createAnimation().addElement(
      getIonPageElement(opts.leavingEl!)
    );

    // actual customized animation
    if (opts.direction === 'forward') {
      // enteringPage.fromTo('transform', 'translateX(100%)', 'translateX(0)');
      enteringPage.fromTo('zoom', '0.8', '1');
      // leavingPage.fromTo('opacity', '1', '0.25');
      leavingPage.fromTo('zoom', '1', '0');

    } else {
      // leavingPage.fromTo('transform', 'translateX(100%)', 'translateX(0)');
      leavingPage.fromTo('zoom', '0.8', '1');
      // enteringPage.fromTo('opacity', '1', '0.25');
      enteringPage.fromTo('zoom', '1', '0');
    }

    // include animations for both pages into the root animation
    rootTransition.addAnimation(enteringPage);
    rootTransition.addAnimation(leavingPage);
    return rootTransition;

    const root = baseEl.shadowRoot!;

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.ion-page')!)
      .keyframes([
        { offset: 0, opacity: '0.8', transform: 'scale(0)' },
        { offset: 1, opacity: '1', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(150)
      .addAnimation([wrapperAnimation]);
  }

  cubicLeaveAnimation(baseEl: HTMLElement) {
    return this.storyEnterAnimation(baseEl).direction('reverse');
  }
}

export const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(
    ':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'
  );
  if (ionPage) {
    return ionPage;
  }
  // idk, return the original element so at least something animates
  // and we don't have a null pointer
  return element;
};

export interface TransitionOptions {
  progressCallback?: ((ani: Animation | undefined) => void);
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
  direction: string;
  duration?: number;
}