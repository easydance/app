import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { GetUserResponseDto } from 'src/app/apis';

@Component({
  selector: 'follower-modal',
  templateUrl: './follower-modal.component.html',
  styleUrls: ['./follower-modal.component.scss'],
})
export class FollowerModalComponent implements OnInit {
  @ViewChild('modal')
  public modal?: IonModal;
  @Input() public title: string = '';
  @Input() public followers: GetUserResponseDto[] = [];


  constructor() { }

  ngOnInit() { }

}
