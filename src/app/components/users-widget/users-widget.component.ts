import { Component, Input, OnInit } from '@angular/core';
import { UserBaseDto } from 'src/app/apis';

@Component({
  selector: 'users-widget',
  templateUrl: './users-widget.component.html',
  styleUrls: ['./users-widget.component.scss'],
})
export class UsersWidgetComponent  implements OnInit {

  @Input() users: Pick<UserBaseDto, 'profileImage' | 'id' | 'firstName' | 'lastName'>[] = [];

  constructor() { }

  ngOnInit() {}

}
