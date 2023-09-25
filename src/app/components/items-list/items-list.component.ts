import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { PartyBaseDto } from 'src/app/apis';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {

  @Input() headerOpts?: { title: string, subtitle?: string, avatar?: string; hidden?: boolean; } = {
    title: ''
  };
  @Input() parties?: PartyBaseDto[];
  @Input() itemOptions?: { onItemClick?: (party: PartyBaseDto) => void; transparent?: boolean } = {};
  @Input() footerOpts?: { buttonLabel?: string; hidden?: boolean; } = {};

  @Output() itemClick: EventEmitter<PartyBaseDto> = new EventEmitter();
  @Output() more: EventEmitter<void> = new EventEmitter();

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  goto(party: PartyBaseDto) {
    this.itemClick.emit(party);
    if (this.itemOptions?.onItemClick) {
      return this.itemOptions.onItemClick(party);
    }
    this.navCtrl.navigateForward('/event-detail/' + party.id);
  }
}
