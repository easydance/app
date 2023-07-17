import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClubBaseDto } from 'src/app/apis';

@Component({
  selector: 'easy-clubs-grid',
  templateUrl: './clubs-grid.component.html',
  styleUrls: ['./clubs-grid.component.scss'],
})
export class ClubsGridComponent implements OnInit {
  @Input() title: string = '';
  @Input() rightText: string = '';
  @Input() clubs: ClubBaseDto[] = [];

  @Output() rightButton: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
