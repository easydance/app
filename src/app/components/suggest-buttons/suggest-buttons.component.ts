import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthManagerService } from 'src/app/services/auth-manager.service';

@Component({
  selector: 'easy-suggest-buttons',
  templateUrl: './suggest-buttons.component.html',
  styleUrls: ['./suggest-buttons.component.scss'],
})
export class SuggestButtonsComponent implements OnInit {

  public city?: string;

  @Output() events: EventEmitter<void> = new EventEmitter();
  @Output() clubs: EventEmitter<void> = new EventEmitter();

  constructor(private readonly authManager: AuthManagerService) { }

  ngOnInit() {
    this.authManager.city$.subscribe(res => {
      this.city = res;
    });
  }

}
