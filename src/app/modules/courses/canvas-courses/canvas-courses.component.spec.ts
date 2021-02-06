import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanvasCoursesComponent } from './canvas-courses.component';

describe('CanvasCoursesComponent', () => {
  let component: CanvasCoursesComponent;
  let fixture: ComponentFixture<CanvasCoursesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
