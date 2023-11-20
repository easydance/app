import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, tap, throwError } from 'rxjs';
import { PartyBaseDto, SavedPartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

export type CardOptions = {
  height?: string,
  hideHeader?: boolean;
  showHours?: boolean;
  mergeWithBg?: boolean;
};

@Component({
  selector: 'party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.scss'],
})
export class PartyCardComponent implements OnInit {

  @Input() party?: PartyBaseDto;
  @Input() button?: boolean;
  @Input() options: CardOptions = {};

  @Output() bookmarkClick: EventEmitter<PartyBaseDto> = new EventEmitter();

  constructor(private savedPartiesService: SavedPartyService, private toastCtrl: ToastController, private authManager: AuthManagerService) { }

  ngOnInit() { }

  onBookmarkClick($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.bookmarkClick.emit(this.party);
    if (this.party?.id) {
      if (!this.party.saved) {
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
            if (this.party) this.party.saved = res.data.id || null;
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
            if (this.party) this.party.saved = null;
          });
      }
    }

  }

}
