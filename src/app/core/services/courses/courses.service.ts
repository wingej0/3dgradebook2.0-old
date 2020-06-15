import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Course } from '../../models/course';
import { Observable, from, combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';
import { StandardsService } from '../standards/standards.service';
import { StudentsService } from '../students/students.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  courses$ : Observable<Course[]> = this.auth.user$
    .pipe(concatMap(user => {
    return this.db.list(`${user.uid}/courses`,
      ref => ref.orderByChild('section'))
      .snapshotChanges()
      .pipe(map(snaps => convertSnaps<Course>(snaps))
      );
    }));
  
  displayedCourses$ : Observable<Course[]> = combineLatest(
    [this.courses$,
    this.standardsService.standardsGroups$,
    this.studentsService.students$]
  ).pipe(map(([courses, standards, students]) => {
    return courses.map(
      c => (
        {...c,
          standards : standards.find(s => s.id == c.standardsID) ? standards.find(s => s.id == c.standardsID).name : "",
          numberOfStudents : students.filter(st => st.courses.includes(c.id)).length,
        }
      )
    )
  }))  
  
  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService,
    private standardsService : StandardsService,
    private studentsService : StudentsService
  ) { }

  // Create new course
  createCourse(course: Course) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        course.numberOfStudents = 0;
        let courseRef = this.db.list(`${user.uid}/courses`);
        return from(courseRef.push(course));
      }));
  }

  // Update course
  updateCourse(course: Partial<Course>, id: string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let courseRef = this.db.object(`${user.uid}/courses/${id}`);
        return from(courseRef.update(course));
      }));
  }

  // Delete course
  deleteCourse(course: Course) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let courseRef = this.db.object(`${user.uid}/courses/${course.id}`);
        return from(courseRef.remove());
      }));
  }
}
