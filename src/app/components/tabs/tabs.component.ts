import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';
import { FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'easy-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @ViewChild('modal') modal?: IonModal;

  constructor(public fullImmersionService: FullImmersionService, private navctrl: NavController) { }

  ngOnInit() { }

  goInFullImmersion() {
    if (this.fullImmersionService.selectedClub) {
      this.modal?.present();
      return;
    }
    this.navctrl.navigateForward('/full-immersion/scan');
  }

}
