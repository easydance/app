import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PartyBaseDto, PartyService } from 'src/app/apis';
import { customMapStyle } from 'src/app/utils/google-maps.utils';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  public party?: PartyBaseDto;
  public center: { lat: number, lng: number; } = { lat: 0, lng: 0 };
  public options: google.maps.MapOptions = {
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    rotateControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: customMapStyle
  };

  constructor(
    private route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.partiesService.findOne(res['id'], undefined, 'club.address').subscribe(res => {
        this.party = res.data;
        this.center = {
          lat: this.party.club.address.lat as number,
          lng: this.party.club.address.lng as number
        };
      });
    });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.params['id'];
    this.partiesService.findOne(id, undefined, 'club.address').subscribe(res => {
      this.party = res.data;
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
