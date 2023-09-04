import { TestBed } from '@angular/core/testing';

import { FullImmersionService } from './full-immersion.service';

describe('FullImmersionService', () => {
  let service: FullImmersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullImmersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
