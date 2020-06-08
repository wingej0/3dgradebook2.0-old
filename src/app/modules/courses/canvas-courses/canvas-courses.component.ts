import { Component, OnInit } from '@angular/core';
import { CanvasCoursesService } from 'src/app/core/services/canvas-courses/canvas-courses.service';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { Course } from 'src/app/core/models/course';

@Component({
  selector: 'app-canvas-courses',
  templateUrl: './canvas-courses.component.html',
  styleUrls: ['./canvas-courses.component.css']
})
export class CanvasCoursesComponent implements OnInit {
  courses;
  canvasCourses;

  constructor(
    private canvasCoursesService : CanvasCoursesService,
    private coursesService : CoursesService
  ) { }

  ngOnInit(): void {
    this.getCourses();
    this.getCanvasCourses();
  }

  getCanvasCourses() {
    this.canvasCoursesService.getCourses()
    .subscribe(canvasCourses => {
      this.canvasCourses = canvasCourses;
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
  }

}
