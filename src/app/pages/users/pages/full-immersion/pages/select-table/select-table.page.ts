import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ClubBaseDto, ClubService, CurrentParty } from 'src/app/apis';
import { FullImmersionService } from 'src/app/pages/users/pages/full-immersion/services/full-immersion.service';

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.page.html',
  styleUrls: ['./select-table.page.scss'],
})
export class SelectTablePage implements OnInit {

  public club?: ClubBaseDto;
  public tableName: string = '';
  private currentParty?: CurrentParty;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private readonly fullImmersionService: FullImmersionService,
    private readonly clubsService: ClubService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.club = this.fullImmersionService.selectedClub;
    if (!this.club?.id) return;
    this.currentParty = await lastValueFrom(this.clubsService.getCurrentParty(this.club.id));
    this.fullImmersionService.setCurrentParty(this.currentParty);
  }

  async next() {
    console.log("Club", this.club, "Party", this.currentParty);
    if (!this.club?.id || !this.currentParty) return;

    const table = this.currentParty.tables.find(t => t.name.toLowerCase().trim() == this.tableName.toLocaleLowerCase().trim());
    if (table) {
      this.fullImmersionService.setSelectedTable(table);
      this.navCtrl.navigateForward('/full-immersion/order');
      return;
    }

    const toast = await this.toastCtrl.create({ message: 'Non esiste nessun tavolo con questo nominativo!', duration: 3000 });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
