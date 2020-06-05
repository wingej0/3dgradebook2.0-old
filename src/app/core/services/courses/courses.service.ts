import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Course } from '../../models/course';
import { Observable, from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService
  ) { }

  // Get list of courses
  getCourses(sortBy) : Observable<Course[]> {
    return this.auth.user$
      .pipe(concatMap(user => {
        return this.db.list(`${user.uid}/courses`,
          ref => ref.orderByChild(sortBy))
          .snapshotChanges()
          .pipe(map(snaps => convertSnaps<Course>(snaps))
          );
      }))
  }

  // Create new course
  createCourse(course: Course) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
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
