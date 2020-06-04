import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Course } from 'src/app/core/models/course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  formTitle : string;
  courseForm;
  courses;

  constructor(
    private coursesService : CoursesService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCourses();
    this.setForm();
  }

  setForm(course? : string) {
    this.formTitle = 'Add a Course';
    this.courseForm = this.fb.group({
      name : ['', Validators.required],
      section : ['', Validators.required],
      standards : [''],
      active : [true],
    });
  }

  getCourses() {
    this.coursesService.getCourses()
    .subscribe(courses => {
      this.courses = courses;
    })
  }

  updateCourse() {
    let newCourse = this.courseForm.value;
    this.coursesService.createCourse(newCourse)
      .subscribe(res => console.log(res));
  }

}
