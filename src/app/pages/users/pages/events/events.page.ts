import { Component, OnInit, ViewChild } from '@angular/core';
import { ClubBaseDto, ClubService, GetClubResponseDto, GetPartyResponseDto, PartyBaseDto, PartyService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { DateTime } from "luxon";
import { NavController } from '@ionic/angular';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';
import { UsersPage } from 'src/app/pages/users/users.page';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  @ViewChild('searchHeader') searchHeader?: SearchHeaderComponent;

  public parties?: GetPartyResponseDto[];
  public partiesTonight?: GetPartyResponseDto[];
  public clubs?: (GetClubResponseDto & { parties?: GetPartyResponseDto[]; })[];
  public orderedClubs?: (GetClubResponseDto & { parties?: GetPartyResponseDto[]; })[];
  public city?: string;

  public filters: any = [];

  constructor(
    public readonly authManager: AuthManagerService,
    private readonly partiesService: PartyService,
    private readonly navCtrl: NavController,
    private readonly clubFollowerService: UserToClubFollowerService,
    public readonly partiesUtils: CommonPartiesUtils,
    private readonly translate: TranslateService
  ) {

    UsersPage.tabClicked.subscribe(res => {
      this.searchHeader?.clearSearch();
    });

    this.authManager.user$.subscribe(res => {
      if (res) {
        this.filters = this.buildFilters(res.savedParties, res.followingClubs);
        this.clubFollowerService.findAll(0, 4, JSON.stringify({
          user: { id: this.authManager.user?.id || 0 }
        }), undefined, undefined, 'club.address,user').subscribe(res => {
          this.clubs = res.data.map(cf => ({ ...cf.club, parties: [] }));
          for (let club of (this.clubs || [])) {
            // Club parties
            this.partiesService.findAll(0, 5, JSON.stringify({ club: { id: club.id }, to: { $gte: DateTime.now().toISO() } }), undefined, undefined, 'club')
              .subscribe(res => {
                club.parties = res.data;
              });
          }
          this.orderedClubs = this.clubs;
        });
      }
    });
  }

  ngOnInit() {
    this.authManager.geocoding$.subscribe(res => {
      this.city = this.authManager.city;
    });
  }

  buildFilters(eventSaved: number, savedClub: number) {
    return [
      {
        icon: 'calendar-outline',
        title: this.translate.instant('APP.EVENTS.FILTERS.TODAY'),
        subtitle: DateTime.now().toFormat('dd LLL'),
        onSelect: this.partiesUtils.CommonFilterActions.Today.bind(this.partiesUtils)
      },
      {
        icon: 'bookmark',
        title: this.translate.instant('APP.EVENTS.FILTERS.SAVED'),
        subtitle: this.translate.instant('APP.EVENTS.FILTERS.SAVED_SUB', { eventSaved }),
        onSelect: this.partiesUtils.CommonFilterActions.Saved.bind(this.partiesUtils)
      },
      {
        icon: 'calendar-outline',
        title: this.translate.instant('APP.EVENTS.FILTERS.WEEKEND'),
        subtitle: this.translate.instant('APP.EVENTS.FILTERS.WEEKEND_SUB'),
        onSelect: this.partiesUtils.CommonFilterActions.Weekend.bind(this.partiesUtils)
      },
      {
        icon: 'calendar-outline',
        title: this.translate.instant('APP.EVENTS.FILTERS.CLUBS'),
        subtitle: this.translate.instant('APP.EVENTS.FILTERS.CLUBS_SUB', { savedClub }),
        onSelect: this.partiesUtils.CommonFilterActions.FavoritesClubs.bind(this.partiesUtils)
      },
      {
        icon: 'sparkles-sharp',
        title: this.translate.instant('APP.EVENTS.FILTERS.FOR_YOU'),
        subtitle: this.translate.instant('APP.EVENTS.FILTERS.FOR_YOU_SUB', { n: 9 }),
        onSelect: this.partiesUtils.CommonFilterActions.ForYou.bind(this.partiesUtils)
      },
    ];
  }

  ionViewWillEnter() {
    // Top parties
    this.partiesService.findAll(
      0,
      20,
      JSON.stringify({
        to: { $gte: new Date() },
        ...this.partiesUtils.Filters().InCurrentPosition()
      }),
      undefined,
      undefined,
      'club.address,address'
    ).subscribe(res => {
      this.parties = res.data;
    });
    // Tonight parties
    this.partiesService.findAll(0, 5, JSON.stringify({
      from: {
        $lte: DateTime.now().endOf('day').toISO()
      },
      to: {
        $gte: DateTime.now().startOf('day').toISO()
      }
    }), undefined, undefined, 'club.address').subscribe(res => {
      this.partiesTonight = res.data;
    });

    if (this.authManager.user) {
      this.clubFollowerService.findAll(0, 4, JSON.stringify({
        user: { id: this.authManager.user?.id }
      }), undefined, undefined, 'club.address,user').subscribe(res => {
        this.clubs = res.data.map(cf => ({ ...cf.club, parties: [] }));
        for (let club of (this.clubs || [])) {
          // Club parties
          this.partiesService.findAll(0, 5, JSON.stringify({ club: { id: club.id }, to: { $gte: DateTime.now().toISO() } }), undefined, undefined, 'club')
            .subscribe(res => {
              club.parties = res.data;
            });
        }
      });
    }
  }

  shiftClub(clubId: number) {
    const club = this.clubs?.find(c => c.id == clubId);
    if (club) {
      this.orderedClubs = [club, ...(this.clubs?.filter(c => c.id != clubId) || [])];
    }
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }


  goToClubsEventsList(club: ClubBaseDto) {
    this.navCtrl.navigateForward('/events-list', {
      queryParams: {
        title: this.translate.instant('APP.GOTO_EVENTLIST_CLUB', { name: club.name }),
        header: {
          title: club.name,
          subtitle: this.translate.instant('APP.EVENTS')
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


}
