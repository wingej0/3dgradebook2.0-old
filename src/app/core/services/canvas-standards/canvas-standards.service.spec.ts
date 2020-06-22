import { TestBed } from '@angular/core/testing';

import { CanvasStandardsService } from './canvas-standards.service';

describe('CanvasStandardsService', () => {
  let service: CanvasStandardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasStandardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
