import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'easy-thats-all',
  templateUrl: './thats-all.component.html',
  styleUrls: ['./thats-all.component.scss'],
})
export class ThatsAllComponent  implements OnInit {

  @Input() message?: string;

  constructor() { }

  ngOnInit() {}

}
