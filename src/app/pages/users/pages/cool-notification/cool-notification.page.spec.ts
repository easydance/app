import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoolNotificationPage } from './cool-notification.page';

describe('CoolNotificationPage', () => {
  let component: CoolNotificationPage;
  let fixture: ComponentFixture<CoolNotificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoolNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
