import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { PartyBaseDto, PartyParticipationService, PartyService } from 'src/app/apis';
import { customMapStyle } from 'src/app/utils/google-maps.utils';

@Component({
  selector: 'event-detail-page',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  @Input('party') public party?: PartyBaseDto;
  @Input('config') config: { hideMap?: boolean, hideHeader?: boolean; } = {
    hideMap: false,
    hideHeader: false
  };

  constructor(
    private route: ActivatedRoute,
    private readonly navCtrl: NavController,
    private readonly partiesService: PartyService,
    private readonly partecipantsServices: PartyParticipationService,
    private readonly toastCtrl: ToastController
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
            participants: 1
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
      return
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
}
