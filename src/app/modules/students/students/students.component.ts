import { Component, OnInit } from '@angular/core';
import { StudentsService } from 'src/app/core/services/students/students.service';
import { Observable, combineLatest } from 'rxjs';
import { Student } from 'src/app/core/models/student';
import { map } from 'rxjs/operators';
import { Course } from 'src/app/core/models/course';
import { CoursesService } from 'src/app/core/services/courses/courses.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students$ = this.studentsService.displayedStudents$;
  courses$ : Observable<Course[]> = this.coursesService.displayedCourses$;
  studentFormTitle;
  studentForm;
  filterText : string;

  cData$ = combineLatest([
    this.students$,
    this.courses$,
    this.auth.user$
  ]).pipe(map(([students, courses, user]) => {
    return ({students, courses, user})
  }))

  constructor(
    private studentsService : StudentsService,
    private coursesService : CoursesService,
    private fb : FormBuilder,
    private auth : AuthService
  ) { }

  ngOnInit(): void {
    this.setStudentForm();
  }

  setStudentForm(student? : Student) {
    if (student) {
      this.studentFormTitle = "Edit" + student.lastName + ", " + student.firstName;
      this.studentForm = this.fb.group({
        id : [student.id],
        firstName : [student.firstName, Validators.required],
        lastName : [student.lastName, Validators.required],
        email : [student.email, Validators.required],
        parentName : [student.parentName],
        parentEmail : [student.parentEmail]
      })
    } else {
      this.studentFormTitle = "Add a New Student";
      this.studentForm = this.fb.group({
        firstName : ['', Validators.required],
        lastName : ['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        parentName : [''],
        parentEmail : ['', Validators.email]
      })
    }
  }

  updateStudent(course : string) {
    let student = this.studentForm.value;
    if (student.id) {
      let id = student.id;
      delete student.id;
      return this.studentsService.updateStudent(student, id)
        .subscribe();
    } else {
      student.course = course;
      return this.studentsService.createStudent(student)
        .subscribe();
    }
  }

  deleteStudent(student) {
    let result = confirm("Are you sure you want to delete '" + student.lastName + ", " + student.firstName + "'?");
    if (result) {
      return this.studentsService.deleteStudent(student)
        .subscribe(() => {
          return;
        },
        error => {
          alert(error.message);
        })
    }
  }

  setActive(id) {
    this.studentsService.activeCoursesAction.next(id);
  }

}
