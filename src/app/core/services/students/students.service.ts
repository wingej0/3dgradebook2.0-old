import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, from } from 'rxjs';
import { Student } from '../../models/student';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  public students$ : Observable<Student[]> = this.auth.user$
  .pipe(concatMap(user => {
  return this.db.list(`${user.uid}/students`,
    ref => ref.orderByChild('lastName'))
    .snapshotChanges()
    .pipe(map(snaps => convertSnaps<Student>(snaps))
    );
  }));

  public activeCoursesAction = new BehaviorSubject<string>("");
  private activeCourseAction$ = this.activeCoursesAction.asObservable();

  public displayedStudents$ = combineLatest([
    this.students$,
    this.activeCourseAction$
  ]).pipe(map(([students, course]) => {
    if (course !== "undefined") {
      students = students.filter(student => student.course == course);
    } else {
      students = [];
      course = null;
    }
    return ({students, course});
  }));

  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService,
  ) { }

  public createStudent(student: Student) : Observable<any> {
    student = {
      ...student,
      passcode : this.generatePasscode(),
    };
    return this.auth.user$
      .pipe(concatMap(user => {
        let courseRef = this.db.list(`${user.uid}/students`);
        return from(courseRef.push(student));
      }));
  }

  public updateStudent(student: Partial<Student>, id: string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let studentRef = this.db.object(`${user.uid}/students/${id}`);
        return from(studentRef.update(student));
      }));
  }

  public deleteStudent(student: Student) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let studentRef = this.db.object(`${user.uid}/students/${student.id}`);
        return from(studentRef.remove());
      }));
  }

  generatePasscode() {
    let possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    let passcode = "";
    for (let i = 0; i < 13; i++) {
      passcode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return passcode;
  }
}
