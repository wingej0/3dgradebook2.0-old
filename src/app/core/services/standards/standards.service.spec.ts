import { TestBed } from '@angular/core/testing';

import { StandardsService } from './standards.service';

describe('StandardsService', () => {
  let service: StandardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
