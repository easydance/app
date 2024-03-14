import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, NavController, Platform, ToastController } from '@ionic/angular';
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
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  isInSection(section: string) {
    return location.pathname == section;
  }

  goInFullImmersion() {
    if (!this.authManager.isAuthenticated()) {
      this.toastCtrl.create({ duration: 3000, message: 'Devi essere registrato per poter usufruire di questa funzionalità!' })
        .then(toast => {
          toast.present();
        });
      return;
    }
    if (this.fullImmersionService.selectedClub) {
      this.modal?.present();
      return;
    }
    this.navctrl.navigateForward('/full-immersion/scan');
  }

}
