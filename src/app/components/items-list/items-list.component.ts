import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { GetClubResponseDto, GetPartyResponseDto, PartyBaseDto } from 'src/app/apis';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {

  @Input() headerOpts?: { title: string, subtitle?: string, avatar?: string; hidden?: boolean; } = {
    title: ''
  };
  @Input() parties?: GetPartyResponseDto[];
  @Input() clubs?: GetClubResponseDto[];
  @Input() itemOptions?: { onItemClick?: (party: GetPartyResponseDto | GetClubResponseDto) => void; transparent?: boolean; } = {};
  @Input() footerOpts?: { buttonLabel?: string; hidden?: boolean; } = {};

  @Output() itemClick: EventEmitter<PartyBaseDto | GetClubResponseDto> = new EventEmitter();
  @Output() more: EventEmitter<void> = new EventEmitter();

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  goto(party: GetPartyResponseDto) {
    this.itemClick.emit(party);
    if (this.itemOptions?.onItemClick) {
      return this.itemOptions.onItemClick(party);
    }
    this.navCtrl.navigateForward('/event-detail/' + party.id);
  }

  gotoClub(club: GetClubResponseDto) {
    this.itemClick.emit(club);
    if (this.itemOptions?.onItemClick) {
      return this.itemOptions.onItemClick(club);
    }
    this.navCtrl.navigateForward('/club-detail/' + club.id);
  }

  getFrom(party: PartyBaseDto) {
    return new Date(party.from) < new Date() ? new Date() : party.from;
  }
}
