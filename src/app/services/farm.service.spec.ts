import { TestBed } from '@angular/core/testing';

import { FarmService } from './farm.service';

describe('FarmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FarmService = TestBed.get(FarmService);
    expect(service).toBeTruthy();
  });
});
