import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CanvasCoursesService {
  user;

  constructor(
    private auth : AuthService,
    private http : HttpClient
  ) { }

  getSections(courseID) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let domain = user.import.domain;
        let token = user.import.token;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get('https://cors-anywhere.herokuapp.com/' + user.import.domain + '/api/v1/courses/' + courseID + '/sections', { headers })
      }))
  }
  
  getCourses() : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let domain = user.import.domain;
        let token = user.import.token;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get('https://cors-anywhere.herokuapp.com/' + domain + '/api/v1/courses?enrollment_type=teacher&enrollment_state=active', { headers })
      }))
  }

}
