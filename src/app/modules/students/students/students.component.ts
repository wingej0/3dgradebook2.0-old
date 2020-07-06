import { Component, OnInit } from '@angular/core';
import { StudentsService } from 'src/app/core/services/students/students.service';
import { Observable, combineLatest } from 'rxjs';
import { Student } from 'src/app/core/models/student';
import { map } from 'rxjs/operators';
import { Course } from 'src/app/core/models/course';
import { CoursesService } from 'src/app/core/services/courses/courses.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students$ : Observable<Student[]> = this.studentsService.displayedStudents$;
  courses$ : Observable<Course[]> = this.coursesService.displayedCourses$;
  filterText : string;

  cData$ = combineLatest([
    this.students$,
    this.courses$
  ]).pipe(map(([students, courses]) => {
    return ({students, courses})
  }))

  constructor(
    private studentsService : StudentsService,
    private coursesService : CoursesService
  ) { }

  ngOnInit(): void {
  }

  setActive(id) {
    this.studentsService.activeCoursesAction.next(id);
  }

}
