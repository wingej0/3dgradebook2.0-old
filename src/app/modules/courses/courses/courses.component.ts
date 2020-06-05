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
  standards;
  showActive: boolean = true;

  constructor(
    private coursesService : CoursesService,
    private fb : FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCourses();
    this.setForm();
    this.standards = this.getStandards();
  }

  setForm(course? : Course) {
    if (course) {
      this.formTitle = 'Edit ' + course.name;
      this.courseForm = this.fb.group({
        id : [course.id],
        name : [course.name, Validators.required],
        section : [course.section, Validators.required],
        standards : [course.standards],
        active : [course.active]
      });
    } else {
      this.formTitle = 'Add a Course';
      this.courseForm = this.fb.group({
        name : ['', Validators.required],
        section : ['', Validators.required],
        standards : [''],
        active : [true],
    });
    }
  }

  getCourses() {
    this.coursesService.getCourses()
    .subscribe(courses => {
      if (this.showActive) {
        this.courses = courses.filter(course => course.active);
      } else {
        this.courses = courses;
      }
    })
  }

  updateCourse() {
    if (this.courseForm.value.id) {
      let id = this.courseForm.value.id;
      let updatedCourse = this.courseForm.value;
      // Delete the id field from the object before saving
      delete updatedCourse.id;
      this.coursesService.updateCourse(updatedCourse, id)
        .subscribe(() => this.setForm());
    } else {
      let newCourse = this.courseForm.value;
      this.coursesService.createCourse(newCourse)
        .subscribe(() => this.setForm());
    }
  }

  deleteCourse(course) {
    let result = confirm("Are you sure you want to delete '" + course.name + " | " + course.section + "'?");
    if (result) {
      return this.coursesService.deleteCourse(course)
        .subscribe();
    }
  }

  archiveToggle(course) {
    let id = course.id;
    let active = {
      active : !course.active,
    };
    this.coursesService.updateCourse(active, id)
      .subscribe();
  }

  getStandards() {
    return [
      { id: '1', name: 'order 1' },
      { id: '2', name: 'order 2' },
      { id: '3', name: 'order 3' },
      { id: '4', name: 'order 4' }
    ];
  }
}
