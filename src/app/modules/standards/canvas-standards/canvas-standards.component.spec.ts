import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanvasStandardsComponent } from './canvas-standards.component';

describe('CanvasStandardsComponent', () => {
  let component: CanvasStandardsComponent;
  let fixture: ComponentFixture<CanvasStandardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasStandardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
