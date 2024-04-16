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
import { StoryController } from 'src/app/services/story.service';

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
  public clubs?: (GetClubResponseDto & { parties: GetPartyResponseDto[]; })[];
  public city?: string;
  public filter: any = {};


  constructor(
    private readonly partiesService: PartyService,
    private readonly authManager: AuthManagerService,
    private readonly navCtrl: NavController,
    private readonly clubFollowerService: UserToClubFollowerService,
    public readonly partiesUtils: CommonPartiesUtils,
    private changeDetector: ChangeDetectorRef,
    private commonPartiesUtils: CommonPartiesUtils,
    private storyCtrl: StoryController
  ) { }

  ngOnInit() {

    UsersPage.tabClicked.subscribe(res => {
      this.searchHeader?.clearSearch();
    });

    this.authManager.geocoding$.subscribe(res => {
      this.searchEvents().then(() => {
        this.changeDetector.detectChanges();
      });
    });

    this.authManager.city$.subscribe(city => {
      this.city = this.authManager.currentCity;
    });

    this.authManager.user$.subscribe(res => {
      if (res) {
        this.clubFollowerService.findAll(0, 4, JSON.stringify({
          user: { id: this.authManager.user?.id || 0 }
        }), undefined, undefined, 'club.address').subscribe(res => {
          this.clubs = res.data.map(cf => ({ ...cf.club, parties: [] }));
          for (let club of (this.clubs || [])) {
            // Club parties
            this.partiesService.findAll(0, 5, JSON.stringify({
              to: { $gte: DateTime.now().toISO() },
              club: { id: club.id }
            }), '{"from":"ASC"}', undefined, 'club')
              .subscribe(res => {
                club.parties = res.data;
              });
          }
        });
      }
    });
  }

  ionViewWillEnter() {
    setInterval(() => {
      this.storyWidget?.findStories({ createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() } });
    }, 5 * 60 * 1000);
  }

  searchEvents() {
    return new Promise((resolve, reject) => {

      this.filter = {
        ...this.filter,
        ...this.partiesUtils.Filters().Tonight,
        ...this.partiesUtils.Filters().InCurrentPosition()
      };

      this.partiesService.findAll(0, 5, JSON.stringify(this.filter), '{"distance":"ASC"}', undefined, 'club,address').subscribe(res => {
        this.parties = res.data;
        resolve(res.data);
      });
      if (this.authManager.user) {
        this.clubFollowerService.findAll(0, 4, JSON.stringify({
          user: { id: this.authManager.user?.id || 0 }
        }), undefined, undefined, 'club.address').subscribe(res => {
          this.clubs = res.data.map(cf => ({ ...cf.club, parties: [] }));
          for (let club of (this.clubs || [])) {
            // Club parties
            this.partiesService.findAll(0, 5, JSON.stringify({
              to: {
                $gte: DateTime.now().toISO()
              },
              club: { id: club.id }
            }), '{"from":"ASC"}', undefined, 'club')
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
    this.storyWidget?.findStories({ createdAt: { $gte: DateTime.now().plus({ hours: -24 }).toISO() } });
  }

  makeStory() {
    if (this.authManager.isAuthenticated()) {
      this.storyCtrl.makeStory();
      return;
    }
  }

  async handleStories($event: { user: UserBaseDto, stories: StoryBaseDto[]; }) {
    const { user, stories } = $event;
    if (!stories || !user) {
      this.navCtrl.navigateBack('/story');
      return;
    }
    const storiesModal = await this.storyCtrl.openUserStoriesModal($event);
    storiesModal.onDidDismiss().then(async res => {
      console.log(res);
      if (res.role == 'NEXT_USER') {
        const next = this.storyWidget?.getNext($event.user);
        if (next) {
          await this.handleStories(next.value);
        }
      }
      if (res.role == 'PREVIOUS_USER') {
        const prev = this.storyWidget?.getPrev($event.user);
        if (prev) {
          await this.handleStories(prev.value);
        }
      }
    });

  }

}
