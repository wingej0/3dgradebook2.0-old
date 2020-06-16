import { Component, OnInit, OnDestroy } from '@angular/core';
import { CanvasCoursesService } from 'src/app/core/services/canvas-courses/canvas-courses.service';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-canvas-courses',
  templateUrl: './canvas-courses.component.html',
  styleUrls: ['./canvas-courses.component.css']
})
export class CanvasCoursesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  courses;
  canvasCourses$ = this.canvasCoursesService.displayedCanvasCourses$;

  constructor(
    private canvasCoursesService : CanvasCoursesService,
    private coursesService : CoursesService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getSections(courseID) {
    this.subs.add(
      this.canvasCoursesService.getSections(courseID)
        .subscribe(sections => {
          for (let section of sections) {
            let newCourse = {
              name : section.name,
              section : "",
              numberOfStudents : 0,
              active : true,
              courseID : section.course_id,
              sectionID : section.id
            };
          this.coursesService.createCourse(newCourse)
            .subscribe(() => {
              return;
            },
            error => {
              alert(error.message);
            });
          }
        }
    ))
  }

  importAll(courses) {
    for (let course of courses) {
      this.getSections(course.id);
    };
  }

  importOne(course) {
    this.getSections(course.id);
    alert(course.name + " has been imported successfully.");
  }

  removeCourse(course) {
    this.canvasCoursesService.removeCourse(course.id);
  }
}
