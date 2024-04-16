import { EventEmitter, Injectable } from '@angular/core';
import { AnimationController, ModalController, NavController } from '@ionic/angular';
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
}
