import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoriesV2Page } from './stories-v2.page';

describe('StoriesV2Page', () => {
  let component: StoriesV2Page;
  let fixture: ComponentFixture<StoriesV2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoriesV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
