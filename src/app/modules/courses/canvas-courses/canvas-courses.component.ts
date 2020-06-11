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
  canvasCourses : any[];
  loader : boolean = true;

  constructor(
    private canvasCoursesService : CanvasCoursesService,
    private coursesService : CoursesService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.getCourses();
    this.getCanvasCourses();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getCanvasCourses() {
    this.subs.add(
      this.canvasCoursesService.getCourses()
      .pipe(take(1))
      .subscribe(canvasCourses => {
        this.canvasCourses = canvasCourses;
        this.loader = false;
      },
      error => {
        alert(error.message);
      })
    )
  }

  getCourses() {
    this.subs.add(
      this.coursesService.getCourses("section")
      .subscribe(courses => {
        this.courses = courses;
      })
    )
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
          if (!this.courses.find(course => course.sectionID == newCourse.sectionID)) {
            this.coursesService.createCourse(newCourse)
            .subscribe(() => {
              return;
            },
            error => {
              alert(error.message);
            });
          }
        }
      })
    )
  }

  importAll() {
    for (let course of this.canvasCourses) {
      this.getSections(course.id);
    }
    return this.router.navigate(['/courses']);
  }

  importOne(course) {
    this.getSections(course.id);
    alert(course.name + " has been imported successfully.");
  }

  removeCourse(course) {
    let toDelete = this.canvasCourses.findIndex(c => c.id == course.id);
    this.canvasCourses.splice(toDelete, 1);
  }
}
