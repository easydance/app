import { Component, Input, OnInit } from '@angular/core';
import { PartyBaseDto } from 'src/app/apis';

@Component({
  selector: 'party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.scss'],
})
export class PartyCardComponent implements OnInit {

  @Input() party?: PartyBaseDto;
  @Input() button?: boolean;

  constructor() { }

  ngOnInit() { }

}
