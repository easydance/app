import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { DateTime, Interval } from 'luxon';
import { catchError, tap, throwError } from 'rxjs';
import { ClubBaseDto, PartyBaseDto, SavedPartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { calcDistance } from 'src/app/utils/google-maps.utils';
import { Share } from '@capacitor/share';

export type CardOptions = {
  height?: string,
  hideHeader?: boolean;
  showHours?: boolean;
  mergeWithBg?: boolean;
  fullPeriod?: boolean;
};

@Component({
  selector: 'club-card',
  templateUrl: './club-card.component.html',
  styleUrls: ['./club-card.component.scss'],
})
export class ClubCardComponent implements OnInit {

  @Input() club?: ClubBaseDto;
  @Input() button?: boolean;
  @Input() options: CardOptions = {
    fullPeriod: true,
    showHours: true
  };

  public get covers() {
    if (this.club) {
      return this.club.covers && this.club.covers.length > 0
        ? this.club.covers
        : (
          this.club.profile
            ? [this.club.profile]
            : []
        );
    }

    return [];
  }

  public get distance() {
    const currentLat = this.authManager.geolocation?.coords.latitude;
    const currentLng = this.authManager.geolocation?.coords.longitude;
    return this.club?.address?.lat && this.club?.address?.lng && currentLat && currentLng
      ? calcDistance(
        this.club.address.lat,
        this.club.address.lng,
        currentLat,
        currentLng
      )
      : '-';
  };

  constructor(
    public authManager: AuthManagerService,
    public navCtrl: NavController
  ) { }

  ngOnInit() { }

  gotoClub(club?: ClubBaseDto) {
    this.navCtrl.navigateForward('/club-detai/' + (club || this.club)?.id);
  }
}
