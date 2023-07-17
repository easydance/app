import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartyBaseDto } from 'src/app/apis';

@Component({
  selector: 'easy-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.scss'],
})
export class CardSliderComponent implements OnInit {

  @Input() title: string = '';
  @Input() rightText: string = '';
  @Input() parties: PartyBaseDto[] = [];

  @Output() rightButton: EventEmitter<void> = new EventEmitter();
  @Output() partyClick: EventEmitter<PartyBaseDto> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
