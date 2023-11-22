import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonPartiesUtils } from 'src/app/services/common-parties-utils.service';

@Component({
  selector: 'events-filters',
  templateUrl: './events-filters.component.html',
  styleUrls: ['./events-filters.component.scss'],
})
export class EventsFiltersComponent  implements OnInit {

  @Output() select: EventEmitter<void> = new EventEmitter();

  constructor(public partiesUtils: CommonPartiesUtils) { }

  ngOnInit() {}

}
