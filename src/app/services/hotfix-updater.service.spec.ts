import { TestBed } from '@angular/core/testing';

import { HotfixUpdaterService } from './hotfix-updater.service';

describe('HotfixUpdaterService', () => {
  let service: HotfixUpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotfixUpdaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
