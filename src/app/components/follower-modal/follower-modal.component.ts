import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';
import { GetUserResponseDto, UserBaseDto } from 'src/app/apis';

@Component({
  selector: 'follower-modal',
  templateUrl: './follower-modal.component.html',
  styleUrls: ['./follower-modal.component.scss'],
})
export class FollowerModalComponent implements OnInit {
  @ViewChild('modal') public modal?: IonModal;

  @Input() public options: {
    disableUserRouting: boolean,
    autoClose: boolean,
  } = {
      disableUserRouting: false, autoClose: true
    };
  @Input() public title: string = '';
  @Input() public followers: GetUserResponseDto[] = [];

  @Output() userClick: EventEmitter<UserBaseDto> = new EventEmitter();

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }


  onUserClick(user: UserBaseDto, modal: IonModal) {
    this.userClick.emit();
    if (!this.options.disableUserRouting) {
      this.navCtrl.navigateForward('/profile/' + user.id);
    }
    if (this.options.autoClose) modal.dismiss();
  }

}
