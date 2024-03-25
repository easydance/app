import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, NavController, Platform, ToastController } from '@ionic/angular';
import { ClubService } from 'src/app/apis';
import { FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'easy-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @ViewChild('modal') modal?: IonModal;

  @Output() tabClicked: EventEmitter<string> = new EventEmitter();

  constructor(
    public fullImmersionService: FullImmersionService,
    private navctrl: NavController,
    private authManager: AuthManagerService,
    public platform: Platform,
    private toastCtrl: ToastController,
    private clubsService: ClubService
  ) { }

  ngOnInit() { }

  isInSection(section: string) {
    return location.pathname == section;
  }

  async goInFullImmersion() {
    if (!this.authManager.isAuthenticated()) {
      this.toastCtrl.create({ duration: 3000, message: 'Devi essere registrato per poter usufruire di questa funzionalità!' })
        .then(toast => {
          toast.present();
        });
      return;
    }
    let validParty: boolean = false;
    try {
      if (this.fullImmersionService.selectedClub) {
        const currentPartyResponse = await this.clubsService.getCurrentParty(this.fullImmersionService.selectedClub.id!).toPromise();
        validParty = !!currentPartyResponse?.orderEnabled;
      }
    } catch (error) {
      console.error(error);
    }

    if (this.fullImmersionService.selectedClub && validParty) {
      this.modal?.present();
      return;
    }
    this.fullImmersionService.reset();
    this.navctrl.navigateForward('/full-immersion/scan');
  }

}
