import { Component, OnInit } from '@angular/core';
import { ClubService, GetClubResponseDto, GetPartyResponseDto, PartyBaseDto, PartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { DateTime } from "luxon";
import { NavController } from '@ionic/angular';

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

  public filters = [
    {
      icon: 'calendar-outline',
      title: 'Oggi',
      subtitle: DateTime.now().toFormat('dd LLL'),
      onSelect: () => {
        this.navCtrl.navigateForward('/events-list', {
          queryParams: {
            title: 'Eventi di oggi a ' + this.city,
            header: {
              title: 'Oggi',
              subtitle: 'Eventi'
            },
            filters: JSON.stringify({
              from: {
                $lte: DateTime.now().toISO()
              },
              to: {
                $gte: DateTime.now().toISO()
              }
            })
          }
        });
      }
    },
    { icon: 'bookmark', title: 'Salvati', subtitle: 'XX salvati' },
    {
      icon: 'calendar-outline',
      title: 'Weekend',
      subtitle: 'ven - dom',
      onSelect: () => {
        const dayOfWeek = (new Date().getDay() - 1 + 7) % 7;
        const dayToFriday = dayOfWeek - 4;
        let from = DateTime.now();
        if (dayToFriday < 0) from = DateTime.now().startOf('day').plus({ days: Math.abs(dayToFriday) });
        let to = DateTime.fromMillis(from.toMillis()).plus({ days: 2 }).endOf('day');

        this.navCtrl.navigateForward('/events-list', {
          queryParams: {
            title: 'Eventi questo weekend a ' + this.city,
            header: {
              title: 'ven - dom',
              subtitle: 'Eventi'
            },
            filters: JSON.stringify({
              from: {
                $lte: from.toISO()
              },
              to: {
                $gte: to.toISO()
              }
            })
          }
        });
      }
    },
    { icon: 'calendar-outline', title: 'Locali', subtitle: '3 locali' },
    { icon: 'sparkles-sharp', title: 'Per te', subtitle: '30 eventi' },
  ];

  constructor(
    private readonly authManager: AuthManagerService,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService,
    private readonly navCtrl: NavController
  ) {

    
   }

  ngOnInit() {
    this.authManager.geocoding$.subscribe(res => {
      this.city = res?.address_components?.find((ac: google.maps.GeocoderAddressComponent) => ac.types.includes('locality'))?.short_name;
    });
  }

  ionViewWillEnter() {
    // Top parties
    this.partiesService.findAll(0, 20, undefined, undefined, undefined, 'club').subscribe(res => {
      this.parties = res.data;
    });
    // Tonight parties
    this.partiesService.findAll(0, 5, JSON.stringify({
      from: {
        $lte: DateTime.now().toISO()
      },
      to: {
        $gte: DateTime.now().toISO()
      }
    }), undefined, undefined, 'club').subscribe(res => {
      this.partiesTonight = res.data;
    });

    this.clubsService.findAll(0, 4, undefined, undefined, undefined, 'address').subscribe(res => {
      this.clubs = res.data;
      for (let club of this.clubs) {
        // Club parties
        this.partiesService.findAll(0, 5, JSON.stringify({ club: { id: club.id } }), undefined, undefined, 'club')
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
