import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PartyBaseDto } from 'src/app/apis';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {

  @Input() headerOpts?: { title: string, subtitle?: string, avatar?: string; } = {
    title: ''
  };
  @Input() parties?: PartyBaseDto[];
  @Input() footerOpts?: { buttonLabel?: string; } = {};

  @Output() more: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
