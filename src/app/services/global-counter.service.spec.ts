import { TestBed } from '@angular/core/testing';

import { GlobalCounterService } from './global-counter.service';

describe('GlobalCounterService', () => {
  let service: GlobalCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
