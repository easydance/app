import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, NavController, Platform } from '@ionic/angular';
import { FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';

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
    public platform: Platform
    ) { }

  ngOnInit() { }

  goInFullImmersion() {
    if (this.fullImmersionService.selectedClub) {
      this.modal?.present();
      return;
    }
    this.navctrl.navigateForward('/full-immersion/scan');
  }

}
