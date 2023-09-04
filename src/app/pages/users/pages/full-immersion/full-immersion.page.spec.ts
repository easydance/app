import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullImmersionPage } from './full-immersion.page';

describe('FullImmersionPage', () => {
  let component: FullImmersionPage;
  let fixture: ComponentFixture<FullImmersionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FullImmersionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
