import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatMap, map } from 'rxjs/operators';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { CoursesService } from '../courses/courses.service';
import { CanvasCourse } from '../../models/canvas-course';

@Injectable({
  providedIn: 'root'
})
export class CanvasCoursesService {
  // Observable of Canvas Courses retrieved from the Canvas API
  private canvasCourses$ : Observable<CanvasCourse[]> = this.auth.user$
    .pipe(concatMap(user => {
      let domain = user.import.domain;
      let token = user.import.token;
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get<CanvasCourse[]>('https://cors-anywhere.herokuapp.com/' + domain + '/api/v1/courses?enrollment_type=teacher&enrollment_state=active', { headers })
    }));
  
  private removeCourseAction = new BehaviorSubject<number[]>([]);
  public removeCourseAction$ = this.removeCourseAction.asObservable();
    
  // Observable that returns Canvas courses that haven't already been imported and haven't been removed by the user
  public displayedCanvasCourses$ = combineLatest(
      [this.canvasCourses$,
      this.coursesService.importedCourses$,
      this.removeCourseAction$]
    ).pipe(map(([canvasCourses, courses, remove]) => {
      canvasCourses = canvasCourses.filter(c => !courses.includes(c.id) && !remove.includes(c.id));
      return canvasCourses;
    }));
  
  constructor(
    private auth : AuthService,
    private http : HttpClient,
    private coursesService : CoursesService
  ) { }

  // Allows the user to remove a course from the Canvas course list, so it isn't imported
  removeCourse(id) {
    let removed = this.removeCourseAction.value;
    removed.push(id);
    this.removeCourseAction.next(removed);
  }

  // Retrieves section names and ids for Courses that are imported by the user
  getSections(courseID) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let domain = user.import.domain;
        let token = user.import.token;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get('https://cors-anywhere.herokuapp.com/' + domain + '/api/v1/courses/' + courseID + '/sections', { headers })
      }))
  }
}
