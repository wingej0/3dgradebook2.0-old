import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Course } from '../../models/course';
import { Observable, from, combineLatest, BehaviorSubject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';
import { StandardsService } from '../standards/standards.service';
import { StudentsService } from '../students/students.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  public courses$ : Observable<Course[]> = this.auth.user$
    .pipe(concatMap(user => {
    return this.db.list(`${user.uid}/courses`,
      ref => ref.orderByChild('section'))
      .snapshotChanges()
      .pipe(map(snaps => convertSnaps<Course>(snaps))
      );
    }));
  
  private activeCoursesAction = new BehaviorSubject<boolean>(true);
  public activeCoursesAction$ = this.activeCoursesAction.asObservable();
  
  public displayedCourses$ : Observable<Course[]> = combineLatest(
      [this.courses$,
      this.standardsService.standardsGroups$,
      this.studentsService.students$,
      this.activeCoursesAction$
    ]
    ).pipe(map(([courses, standards, students, active]) => {
      if (active) {
        courses = courses.filter(course => course.active);
      }
      return courses.map(
        c => (
          {...c,
            standards : standards.find(s => s.id == c.standardsID) ? standards.find(s => s.id == c.standardsID).name : "",
            numberOfStudents : students.filter(st => st.course == c.id).length,
          }
        ) as Course
      )
    }))
  
  public importedCourses$ : Observable<number[]>= this.courses$.pipe(map(c => {
    let courses = c.filter(course => course.courseID);
    let importedCourses = courses.map(course => course.courseID);
    return importedCourses;
  }))
  
  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService,
    private standardsService : StandardsService,
    private studentsService : StudentsService
  ) { }

  public showActiveToggle(showActive) {
    this.activeCoursesAction.next(showActive);
  } 

  // Create new course
  public createCourse(course: Course) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let courseRef = this.db.list(`${user.uid}/courses`);
        return from(courseRef.push(course));
      }));
  }

  // Update course
  public updateCourse(course: Partial<Course>, id: string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let courseRef = this.db.object(`${user.uid}/courses/${id}`);
        return from(courseRef.update(course));
      }));
  }

  // Delete course
  public deleteCourse(course: Course) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let courseRef = this.db.object(`${user.uid}/courses/${course.id}`);
        return from(courseRef.remove());
      }));
  }
}
