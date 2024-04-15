import { TestBed } from '@angular/core/testing';

import { InstanceLogService } from './instance-log.service';

describe('InstanceLogService', () => {
  let service: InstanceLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
