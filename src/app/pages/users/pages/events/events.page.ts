import { Component, OnInit } from '@angular/core';
import { ClubService, GetClubResponseDto, GetPartyResponseDto, PartyBaseDto, PartyService, UserToClubFollowerService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { DateTime } from "luxon";
import { NavController } from '@ionic/angular';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  public parties?: GetPartyResponseDto[];
  public partiesTonight?: GetPartyResponseDto[];
  public clubs?: (GetClubResponseDto & { parties?: GetPartyResponseDto[]; })[];
  public city?: string;

  public filters: any = [];

  constructor(
    public readonly authManager: AuthManagerService,
    private readonly partiesService: PartyService,
    private readonly navCtrl: NavController,
    private readonly clubFollowerService: UserToClubFollowerService,
    public readonly partiesUtils: CommonPartiesUtils
  ) {

    this.authManager.user$.subscribe(res => {
      if (res) {
        this.filters = this.buildFilters(res.savedParties, res.followingClubs);
        this.clubFollowerService.findAll(0, 4, JSON.stringify({
          user: { id: this.authManager.user?.id || 0 }
        }), undefined, undefined, 'club.address,user').subscribe(res => {
          this.clubs = res.data.map(cf => cf.club);
          for (let club of this.clubs) {
            // Club parties
            this.partiesService.findAll(0, 5, JSON.stringify({ club: { id: club.id }, to: {$gte: DateTime.now().toISO() } }), undefined, undefined, 'club')
              .subscribe(res => {
                club.parties = res.data;
              });
          }
        });
      }
    });
  }

  ngOnInit() {
    this.authManager.geocoding$.subscribe(res => {
      this.city = res?.address_components?.find((ac: google.maps.GeocoderAddressComponent) => ac.types.includes('locality'))?.short_name;
    });
  }

  buildFilters(eventSaved: number, savedClub: number) {
    return [
      {
        icon: 'calendar-outline',
        title: 'Oggi',
        subtitle: DateTime.now().toFormat('dd LLL'),
        onSelect: this.partiesUtils.CommonFilterActions.Today.bind(this.partiesUtils)
      },
      {
        icon: 'bookmark',
        title: 'Salvati',
        subtitle: eventSaved + ' salvati',
        onSelect: this.partiesUtils.CommonFilterActions.Saved.bind(this.partiesUtils)
      },
      {
        icon: 'calendar-outline',
        title: 'Weekend',
        subtitle: 'ven - dom',
        onSelect: this.partiesUtils.CommonFilterActions.Weekend.bind(this.partiesUtils)
      },
      {
        icon: 'calendar-outline',
        title: 'Locali',
        subtitle: savedClub + ' locali',
        onSelect: this.partiesUtils.CommonFilterActions.FavoritesClubs.bind(this.partiesUtils)
      },
      {
        icon: 'sparkles-sharp',
        title: 'Per te',
        subtitle: '9+ eventi',
        onSelect: this.partiesUtils.CommonFilterActions.ForYou.bind(this.partiesUtils)
      },
    ];
  }

  ionViewWillEnter() {
    // Top parties
    this.partiesService.findAll(0, 20, JSON.stringify({ to: { $gte: new Date() } }), undefined, undefined, 'club').subscribe(res => {
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
    }), undefined, undefined, 'club').subscribe(res => {
      this.partiesTonight = res.data;
    });

    this.clubFollowerService.findAll(0, 4, JSON.stringify({
      user: { id: this.authManager.user?.id }
    }), undefined, undefined, 'club.address,user').subscribe(res => {
      this.clubs = res.data.map(cf => cf.club);
      for (let club of this.clubs) {
        // Club parties
        this.partiesService.findAll(0, 5, JSON.stringify({ club: { id: club.id }, to: {$gte: DateTime.now().toISO()} }), undefined, undefined, 'club')
          .subscribe(res => {
            club.parties = res.data;
          });
      }
    });
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }

}
