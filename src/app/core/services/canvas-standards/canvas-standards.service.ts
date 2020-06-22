import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StandardsService } from '../standards/standards.service';
import { concatMap, map } from 'rxjs/operators';
import { BehaviorSubject, of, combineLatest, Observable } from 'rxjs';
import { CanvasStandard } from '../../models/canvas-standard';

@Injectable({
  providedIn: 'root'
})
export class CanvasStandardsService {
  outcomeGroups$;

  constructor(
    private auth : AuthService,
    private http : HttpClient,
    private standardsService : StandardsService
  ) { }

  getOutcomeGroups(id : string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let domain = user.import.domain;
        let token = user.import.token;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get('https://cors-anywhere.herokuapp.com/' + domain + `/api/v1/courses/${id}/outcome_group_links?per_page=100`, { headers });
      }));
  }

  getOutcomes(url) : Observable<CanvasStandard> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let domain = user.import.domain;
        let token = user.import.token;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get<CanvasStandard>('https://cors-anywhere.herokuapp.com/' + domain + url, { headers });
      }))
  }

}
