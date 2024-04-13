import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { GetUserResponseDto, UserBaseDto } from 'src/app/apis';

@Component({
  selector: 'follower-modal',
  templateUrl: './follower-modal.component.html',
  styleUrls: ['./follower-modal.component.scss'],
})
export class FollowerModalComponent implements OnInit {
  @ViewChild('modal') public modal?: IonModal;

  @Input() public options: { disableUserRouting: boolean } = { disableUserRouting: false };
  @Input() public title: string = '';
  @Input() public followers: GetUserResponseDto[] = [];

  @Output() userClick: EventEmitter<UserBaseDto> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
