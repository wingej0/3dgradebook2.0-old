import { TestBed } from '@angular/core/testing';

import { CanvasCoursesService } from './canvas-courses.service';

describe('CanvasCoursesService', () => {
  let service: CanvasCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
