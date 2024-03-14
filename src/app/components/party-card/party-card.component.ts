import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DateTime, Interval } from 'luxon';
import { catchError, tap, throwError } from 'rxjs';
import { PartyBaseDto, SavedPartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { calcDistance } from 'src/app/utils/google-maps.utils';

export type CardOptions = {
  height?: string,
  hideHeader?: boolean;
  showHours?: boolean;
  mergeWithBg?: boolean;
  fullPeriod?: boolean;
};

@Component({
  selector: 'party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.scss'],
})
export class PartyCardComponent implements OnInit {

  @Input() party?: PartyBaseDto;
  @Input() button?: boolean;
  @Input() options: CardOptions = {
    fullPeriod: true
  };

  get from() {
    if (this.party) {
      const date = new Date(this.party.from).getTime() < Date.now() ? DateTime.now() : DateTime.fromJSDate(new Date(this.party.from));
      if (this.options.fullPeriod === true) {
        const interval = (new Date(this.party.to).getTime() - date.toMillis()) / 1000 / 60 / 60 / 24;
        return interval > 1 ? date.toFormat('dd LLL') + ' - ' + DateTime.fromJSDate(new Date(this.party.to)).toFormat('dd LLL') : date.toFormat('dd LLL');
      }

      return date.toFormat('dd LLL');
    }
    return '-';
  }

  public get distance(): number {
    const currentLat = this.authManager.geolocation?.coords.latitude;
    const currentLng = this.authManager.geolocation?.coords.longitude;
    return this.party?.address?.lat && this.party?.address?.lng && currentLat && currentLng
      ? calcDistance(
        this.party.address.lat,
        this.party.address.lng,
        currentLat,
        currentLng
      )
      : 0;
  };

  @Output() bookmarkClick: EventEmitter<PartyBaseDto> = new EventEmitter();

  constructor(
    private savedPartiesService: SavedPartyService,
    private toastCtrl: ToastController,
    public authManager: AuthManagerService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  onBookmarkClick($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.bookmarkClick.emit(this.party);
    if (this.party?.id) {
      if (!this.party.saved) {
        this.party.saved = -1;
        this.changeDetector.detectChanges();

        this.savedPartiesService.create({ party: this.party.id })
          .pipe(
            tap(x => {
              this.authManager.me().subscribe(res => { });
            }),
            catchError(err => {
              this.toastCtrl.create({ message: 'Non è stato possibile completare l\'operazione', duration: 3000 })
                .then(toast => {
                  toast.present();
                });
              return throwError(() => err);
            })
          )
          .subscribe(res => {
            if (this.party) {
              this.party.saved = res.data.id || null;
              this.changeDetector.detectChanges();
            }
          });
      } else {
        this.savedPartiesService._delete(this.party.saved)
          .pipe(
            tap(x => {
              this.authManager.me().subscribe(res => { });
            }),
            catchError(async err => {
              const toast = await this.toastCtrl.create({ message: 'Non è stato possibile completare l\'operazione', duration: 3000 });
              toast.present();
              return throwError(() => err);
            })
          )
          .subscribe(res => {
            if (this.party) {
              this.party.saved = null;
              this.changeDetector.detectChanges();
            }
          });
        this.party.saved = null;
        this.changeDetector.detectChanges();
      }
    }

  }

}
