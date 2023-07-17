import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
    this.partiesService.findAll(0, 20, undefined, undefined, undefined, 'club').subscribe(res => {
      this.parties = res.data;
    });
    this.clubsService.findAll(0, 4, undefined, undefined, undefined, 'address').subscribe(res => {
      this.clubs = res.data;
    });
  }

  moreEvents() {
    alert('More event');
  }

  goToEvent(party: PartyBaseDto) {
    this.navCtrl.navigateForward(['event-detail', party.id]);
  }
}
