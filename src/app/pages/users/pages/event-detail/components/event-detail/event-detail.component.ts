import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PartyBaseDto, PartyService } from 'src/app/apis';
import { CardOptions } from 'src/app/components/party-card/party-card.component';
import { customMapStyle } from 'src/app/utils/google-maps.utils';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnChanges {
  @Input() cardOptions: CardOptions = { mergeWithBg: true, hideHeader: true, showHours: true };
  @Input('party') public party?: PartyBaseDto;
  @Input('config') config: { hideMap?: boolean; } = {
    hideMap: false,
  };
  public center?: { lat: number, lng: number; };
  public options: google.maps.MapOptions = {
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    rotateControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: customMapStyle,
    gestureHandling: 'none'
  };

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['party']?.currentValue && changes['party'].currentValue.id != changes['party']?.previousValue?.id) {
      this.center = {
        lat: this.party?.address?.lat || this.party?.club?.address?.lat || 0,
        lng: this.party?.address?.lng || this.party?.club?.address?.lng || 0,
      };
    }
  }

  ngOnInit() {

  }

  getImages() {
    return [this.party?.cover, ...(this.party?.images || [])];
  }

}
