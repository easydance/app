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
  public clubs?: GetClubResponseDto[];
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
              subtitle: 'Eventi',
            }
          }
        });
      }
    },
    { icon: 'bookmark', title: 'Salvati', subtitle: 'XX salvati' },
    { icon: 'calendar-outline', title: 'Weekend', subtitle: 'ven - dom' },
    { icon: 'calendar-outline', title: 'Weekend', subtitle: 'ven - dom' },
    { icon: 'calendar-outline', title: 'Weekend', subtitle: 'ven - dom' },
    { icon: 'calendar-outline', title: 'Weekend', subtitle: 'ven - dom' },
  ];

  constructor(
    private readonly authManager: AuthManagerService,
    private readonly partiesService: PartyService,
    private readonly clubsService: ClubService,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
    this.authManager.geocoding$.subscribe(res => {
      this.city = res?.address_components?.find((ac: google.maps.GeocoderAddressComponent) => ac.types.includes('locality'))?.short_name;
    });
  }

  ionViewWillEnter() {
    this.partiesService.findAll(0, 20, undefined, undefined, undefined, 'club').subscribe(res => {
      this.parties = res.data;
    });
    this.clubsService.findAll(0, 4, undefined, undefined, undefined, 'address').subscribe(res => {
      this.clubs = res.data;
    });
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }

}
