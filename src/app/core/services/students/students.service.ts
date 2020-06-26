import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
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

  public displayedStudents$ : Observable<Student[]> = combineLatest([
    this.students$,
    this.activeCourseAction$
  ]).pipe(map(([students, course]) => {
    return students.filter(student => student.course == course);
  }));

  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService,
  ) { }
}
