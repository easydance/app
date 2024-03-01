import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController, ModalController, NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { ClubBaseDto, GetClubResponseDto, GetPartyResponseDto, PartyBaseDto, PartyService, StoryBaseDto, UserBaseDto, UserToClubFollowerService } from 'src/app/apis';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';
import { StoriesWidgetComponent } from 'src/app/components/stories-widget/stories-widget.component';
import { StoriesPage } from 'src/app/pages/users/pages/stories/stories.page';
import { UsersPage } from 'src/app/pages/users/users.page';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('searchHeader') searchHeader?: SearchHeaderComponent;
  @ViewChild('storyWidget') storyWidget?: StoriesWidgetComponent;

  public get isAuthenticated() {
    return this.authManager.isAuthenticated();
  }

  public parties?: GetPartyResponseDto[];
  public clubs?: GetClubResponseDto[];
  public city?: string;
  public filter: any = {};


  constructor(
    private readonly partiesService: PartyService,
    private readonly authManager: AuthManagerService,
    private readonly navCtrl: NavController,
    private readonly clubFollowerService: UserToClubFollowerService,
    public readonly partiesUtils: CommonPartiesUtils,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    private changeDetector: ChangeDetectorRef,
    private commonPartiesUtils: CommonPartiesUtils
  ) { }

  ngOnInit() {

    UsersPage.tabClicked.subscribe(res => {
      this.searchHeader?.clearSearch();
    });

    this.authManager.geocoding$.subscribe(res => {
      this.city = this.authManager.currentCity;
      this.searchEvents().then(() => {
        this.changeDetector.detectChanges();
      });
    });
    this.authManager.user$.subscribe(res => {
      if (res) {
        this.clubFollowerService.findAll(0, 4, JSON.stringify({
          user: { id: this.authManager.user?.id || 0 }
        }), undefined, undefined, 'club.address').subscribe(res => {
          this.clubs = res.data.map(cf => cf.club);
          for (let club of this.clubs) {
            // Club parties
            this.partiesService.findAll(0, 5, JSON.stringify({
              to: { $gte: DateTime.now().toISO() },
              club: { id: club.id }
            }), '{"from":0}', undefined, 'club')
              .subscribe(res => {
                club.parties = res.data;
              });
          }
        });
      }
    });
  }

  ionViewWillEnter() {
  }

  searchEvents() {
    return new Promise((resolve, reject) => {

      this.filter = {
        ...this.filter,
        ...this.partiesUtils.Filters().Tonight,
        ...this.partiesUtils.Filters().InCurrentPosition()
      };

      this.partiesService.findAll(0, 5, JSON.stringify(this.filter), undefined, undefined, 'club,address').subscribe(res => {
        this.parties = res.data;
        resolve(res.data);
      });
      if (this.authManager.user) {
        this.clubFollowerService.findAll(0, 4, JSON.stringify({
          user: { id: this.authManager.user?.id || 0 }
        }), undefined, undefined, 'club.address').subscribe(res => {
          this.clubs = res.data.map(cf => cf.club);
          for (let club of this.clubs) {
            // Club parties
            this.partiesService.findAll(0, 5, JSON.stringify({
              to: {
                $gte: DateTime.now().toISO()
              },
              club: { id: club.id }
            }), '{"from":0}', undefined, 'club')
              .subscribe(res => {
                club.parties = res.data;
              });
          }
        });
      }
    });
  }

  moreEvents() {
    this.navCtrl.navigateForward('/events-list', {
      queryParams: {
        title: 'Eventi di oggi a ' + this.city,
        header: {
          title: 'Oggi',
          subtitle: 'Eventi',
        },
        filters: JSON.stringify({
          ...this.commonPartiesUtils.Filters().Tonight,
          ...this.commonPartiesUtils.Filters().InCurrentPosition()
        })
      }
    });
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward('/event-detail/' + party.id);
  }

  goToClubsEventsList(club: ClubBaseDto) {
    this.navCtrl.navigateForward('/events-list', {
      queryParams: {
        title: 'Eventi al ' + club.name,
        header: {
          title: club.name,
          subtitle: 'Eventi'
        },
        filters: JSON.stringify({
          to: {
            $gte: DateTime.now().toISO()
          },
          club: {
            id: club.id
          }
        })
      }
    });
  }

  refresh($event: any) {
    this.searchEvents().then(res => {
      $event.target.complete();
    });
    this.storyWidget?.findStories();
  }

  makeStory() {
    if (this.authManager.isAuthenticated()) {
      this.navCtrl.navigateBack('/story');
      return;
    }
  }

  async handleStories(user?: UserBaseDto, stories?: StoryBaseDto[]) {
    if (!stories || !user) {
      this.navCtrl.navigateBack('/story');
      return;
    }
    const enterAnimation = (baseEl: HTMLElement) => {
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
        .duration(300)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };
    const storiesModal = await this.modalCtrl.create({
      component: StoriesPage,
      componentProps: {
        filter: { user: { id: user.id } }
      },
      backdropDismiss: true,
      breakpoints: [0, 1],
      enterAnimation,
      leaveAnimation: (baseEl: HTMLElement) => {
        return enterAnimation(baseEl).direction('reverse');
      }
    });
    storiesModal.present();

    storiesModal.onDidDismiss().then(res => {
      console.log(res);
      if (res.role == 'NEXT_USER') {

      }
      if (res.role == 'PREVIOUS_USER') {

      }
    });
  }
}
