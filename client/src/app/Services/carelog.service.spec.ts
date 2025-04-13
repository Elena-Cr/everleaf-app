import { TestBed } from '@angular/core/testing';

import { CareLogService } from './carelog.service';

describe('CarelogService', () => {
  let service: CareLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
