import { Component, OnInit } from '@angular/core';
import { CanvasCoursesService } from 'src/app/core/services/canvas-courses/canvas-courses.service';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { Course } from 'src/app/core/models/course';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-canvas-courses',
  templateUrl: './canvas-courses.component.html',
  styleUrls: ['./canvas-courses.component.css']
})
export class CanvasCoursesComponent implements OnInit {
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

  getCanvasCourses() {
    this.canvasCoursesService.getCourses()
    .pipe(take(1))
    .subscribe(canvasCourses => {
      this.canvasCourses = canvasCourses;
      this.loader = false;
    })
  }

  getCourses() {
    this.coursesService.getCourses("section")
      .subscribe(courses => {
        this.courses = courses;
      })
  }

  getSections(courseID) {
    this.canvasCoursesService.getSections(courseID)
    .subscribe(sections => {
      for (let section of sections) {
        let newCourse = {
          name : section.name,
          section : "",
          active : true,
          courseID : section.course_id,
          sectionID : section.id
        };
        if (!this.courses.find(course => course.sectionID == newCourse.sectionID)) {
          this.coursesService.createCourse(newCourse)
          .subscribe();
        }
      }
    })
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
