import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatMap, map } from 'rxjs/operators';
import { Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { CoursesService } from '../courses/courses.service';
import { CanvasCourse } from '../../models/canvas-course';

@Injectable({
  providedIn: 'root'
})
export class CanvasCoursesService {
  private canvasCourses$ : Observable<CanvasCourse[]> = this.auth.user$
    .pipe(concatMap(user => {
      let domain = user.import.domain;
      let token = user.import.token;
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get<CanvasCourse[]>('https://cors-anywhere.herokuapp.com/' + domain + '/api/v1/courses?enrollment_type=teacher&enrollment_state=active', { headers })
    }));
  
    private removeCourseAction = new BehaviorSubject<number>(null);
    public removeCourseAction$ = this.removeCourseAction.asObservable();
    
    public displayedCanvasCourses$ = combineLatest(
        [this.canvasCourses$,
          this.coursesService.importedCourses$,
          this.removeCourseAction$]
      ).pipe(map(([canvasCourses, courses, remove]) => {
        canvasCourses = canvasCourses.filter(c => !courses.includes(c.id));
        let toDelete = canvasCourses.findIndex(c => c.id == remove);
        if (toDelete != -1) {
          canvasCourses.splice(toDelete, 1);
        }
        return canvasCourses;
      }))
  
  constructor(
    private auth : AuthService,
    private http : HttpClient,
    private coursesService : CoursesService
  ) { }

  removeCourse(id) {
    this.removeCourseAction.next(id);
  }

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
