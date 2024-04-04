import { Component, OnInit } from '@angular/core';
import { UserBaseDto } from 'src/app/apis';

type WhereIsMyFriends = {
  friends: UserBaseDto[];
  friend
}

@Component({
  selector: 'where-is-my-friends',
  templateUrl: './where-is-my-friends.component.html',
  styleUrls: ['./where-is-my-friends.component.scss'],
})
export class WhereIsMyFriendsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
