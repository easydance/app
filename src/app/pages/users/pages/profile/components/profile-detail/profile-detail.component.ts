import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginUserDataDto } from 'src/app/apis';

@Component({
  selector: 'profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProfileDetailComponent  implements OnInit {

  @Input() public user?: LoginUserDataDto;
  @Input() public isMe: boolean = false;

  @Output() edit: EventEmitter<void> = new EventEmitter();


  constructor() { }

  ngOnInit() {}

}
