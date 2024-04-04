import { TestBed } from '@angular/core/testing';

import { WebScocketService } from './web-scocket.service';

describe('WebScocketService', () => {
  let service: WebScocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebScocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
