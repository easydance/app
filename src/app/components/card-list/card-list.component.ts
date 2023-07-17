import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartyBaseDto } from 'src/app/apis';

@Component({
  selector: 'easy-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {

  @Input() title: string = '';
  @Input() rightText: string = '';
  @Input() parties: PartyBaseDto[] = [];

  @Output() rightButton: EventEmitter<void> = new EventEmitter();
  @Output() partyClick: EventEmitter<PartyBaseDto> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
