import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { catchError, tap, throwError } from 'rxjs';
import { GetPartyResponseDto, PartyBaseDto, PartyJoinerService, PartyParticipationService, PartyService, SavedPartyService } from 'src/app/apis';
import { CardOptions } from 'src/app/components/party-card/party-card.component';
import { AuthManagerService } from 'src/app/services/auth-manager.service';
import { Share } from '@capacitor/share';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'event-detail-page',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  @Input('party') public party?: GetPartyResponseDto;
  @Input('config') config: CardOptions & { hideMap?: boolean; } = {
    hideMap: false,
    hideHeader: true,
    showHours: true,
    fullPeriod: true
  };
  private forcedDate?: Date;

  constructor(
    private route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly partecipantsServices: PartyParticipationService,
    private readonly toastCtrl: ToastController,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly savedPartiesService: SavedPartyService,
    public readonly authManager: AuthManagerService,
    private readonly joinerService: PartyJoinerService,
    private readonly translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      if (res['id']) {
        this.partiesService.findOne(res['id'], undefined, 'club.address,address').subscribe(res => {
          this.party = res.data;
          if (this.forcedDate) {
            this.party.from = new Date(this.forcedDate).toISOString() || this.party.from;
          }
          const { participation, ...party } = this.party;
          this.party.participation = this.party.participation ?? {
            party: { ...party, participation: null },
            pr: '',
            participants: 1,
            checked: false,
            confirmed: 0
          };
        });
      }
    });
    this.route.queryParams.subscribe(res => {
      this.forcedDate = res['forcedDate'];
      if (this.party && this.forcedDate) {
        this.party.from = new Date(this.forcedDate).toISOString() || this.party.from;
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
      this.toastCtrl.create({ message: this.translate.instant('APP.EVENT_DETAIL.NO_MORE_THAN_10_PEOPLE'), duration: 2000 })
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
            this.toastCtrl.create({ message:  this.translate.instant('APP.EVENT_DETAIL.GENERIC_ERRORS'), duration: 3000 })
              .then(toast => {
                toast.present();
              });
            return throwError(() => err);
          })
        )
        .subscribe(res => {

          modal?.dismiss();
          this.toastCtrl.create({
            message: this.translate.instant(this.party?.participation?.id ? 'APP.EVENT_DETAIL.EDIT_YOUR_LIST' : 'APP.EVENT_DETAIL.NEW_LIST'),
            duration: 3000
          }).then(toast => {
            toast.present();
            if (this.party?.participation) {
              this.party.participation.id = res.data.id;
            }
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
              this.toastCtrl.create({ message: this.translate.instant('APP.EVENT_DETAIL.GENERIC_ERRORS'), duration: 3000 })
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
            catchError(err => {
              this.toastCtrl.create({ message: this.translate.instant('APP.EVENT_DETAIL.GENERIC_ERRORS'), duration: 3000 })
                .then(toast => toast.present());
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

  joinToPaty() {
    if (this.party) {
      this.joinerService.set({
        party: this.party.id!
      }).pipe(
        catchError(err => {
          this.toastCtrl.create({ message: this.translate.instant('APP.EVENT_DETAIL.GENERIC_ERRORS'), duration: 3000 })
            .then(toast => {
              toast.present();
            });
          return throwError(() => err);
        })).subscribe(res => {
          if (this.party) {
            this.party.joined = (this.party.joined ?? 0) > 0 ? 0 : -1;
            this.partiesService.findOne(this.party.id, undefined, 'club.address,address').subscribe(res => {
              this.party = res.data;
              if (this.forcedDate) {
                this.party.from = new Date(this.forcedDate).toISOString() || this.party.from;
              }
              const { participation, ...party } = this.party;
              this.party.participation = this.party.participation ?? {
                party: { ...party, participation: null },
                pr: '',
                participants: 1,
                checked: false,
                confirmed: 0
              };
            });
          }
        });
    }
  }

  share() {
    Share.share({
      title: this.party?.title,
      text: this.party?.title,
      url: 'https://share.easydance.app/e/' + this.party?.id,
      dialogTitle: this.translate.instant('APP.EVENT_DETAIL.SHARE'),
    });
  }
}
