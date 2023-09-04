import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { ClubService, GetClubResponseDto, GetPartyResponseDto, PartyBaseDto, PartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public parties?: GetPartyResponseDto[];
  public clubs?: GetClubResponseDto[];
  public city?: string;

  constructor(
    private readonly partiesService: PartyService,
    private readonly authManager: AuthManagerService,
    private readonly clubsService: ClubService,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
    this.authManager.geocoding$.subscribe(res => {
      this.city = res?.address_components?.find((ac: google.maps.GeocoderAddressComponent) => ac.types.includes('locality'))?.short_name;
    });
  }

  ionViewWillEnter() {
    this.partiesService.findAll(0, 5, undefined, undefined, undefined, 'club').subscribe(res => {
      this.parties = res.data;
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

  moreEvents() {
    this.navCtrl.navigateForward('/events-list', {
      queryParams: {
        title: 'Eventi di oggi a ' + this.city,
        header: {
          title: 'Oggi',
          subtitle: 'Eventi',
        }
      }
    });
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }

  goToEventsWeekend() {
    const dayOfWeek = (new Date().getDay() - 1 + 7) % 7;
    const dayToFriday = dayOfWeek - 4;
    let from = DateTime.now();
    if (dayToFriday < 0) from = DateTime.now().startOf('day').plus({ days: Math.abs(dayToFriday) });
    let to = DateTime.fromMillis(from.toMillis()).plus({ days: 2 }).endOf('day');

    this.navCtrl.navigateForward('/events-list', {
      queryParams: {
        title: 'Eventi di questo weekend',
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

  goToClubsEventsList() {

  }
}
