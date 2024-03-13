import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { catchError, tap, throwError } from 'rxjs';
import { PartyBaseDto, PartyParticipationService, PartyService, SavedPartyService } from 'src/app/apis';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { customMapStyle } from 'src/app/utils/google-maps.utils';

@Component({
  selector: 'event-detail-page',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  @Input('party') public party?: PartyBaseDto;
  @Input('config') config: { hideMap?: boolean, hideHeader?: boolean; showHours: boolean; } = {
    hideMap: false,
    hideHeader: true,
    showHours: true
  };

  constructor(
    private route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly partecipantsServices: PartyParticipationService,
    private readonly toastCtrl: ToastController,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly savedPartiesService: SavedPartyService,
    public readonly authManager: AuthManagerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      if (res['id']) {
        this.partiesService.findOne(res['id'], undefined, 'club.address,address').subscribe(res => {
          this.party = res.data;
          const { participation, ...party } = this.party;
          this.party.participation = this.party.participation ?? {
            party: { ...party, participation: null },
            pr: '',
            participants: 1,
            checked: false
          };
        });
      }
    });
  }

  ionViewWillEnter() {
  }

  goBack() {
    this.navCtrl.back();
  }

  createOrUpdatePartecipation(modal?: IonModal) {
    if (this.party && this.party.participation && (this.party.participation.participants || 0) > 10) {
      this.toastCtrl.create({ message: 'Non puoi inserire più di 10 partecipanti!', duration: 2000 })
        .then(toast => {
          toast.present();
        });
      return;
    }
    if (this.party?.participation) {
      this.party.participation.party = this.party;
      const { participation, ...party } = this.party;
      this.partecipantsServices.set({ ...this.party.participation, party: { ...party, participation: null } })
        .pipe(
          catchError(err => {
            this.toastCtrl.create({ message: 'Non è stato possibile completare l\'operazione', duration: 3000 })
              .then(toast => {
                toast.present();
              });
            return throwError(() => err);
          })
        )
        .subscribe(res => {
          modal?.dismiss();
          this.toastCtrl.create({ message: 'Lista aggiornata!', duration: 3000 })
            .then(toast => {
              toast.present();
            });
        });
    }
  }
  onBookmarkClick($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
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
