import { TestBed } from '@angular/core/testing';

import { CommonPartiesUtilsService } from './common-parties-utils.service';

describe('CommonPartiesUtilsService', () => {
  let service: CommonPartiesUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonPartiesUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
