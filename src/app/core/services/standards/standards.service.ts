import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Observable, from, BehaviorSubject, combineLatest } from 'rxjs';
import { StandardsGroup } from '../../models/standards-group';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';
import { Standard } from '../../models/standard';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class StandardsService {
  standardsGroups$ : Observable<StandardsGroup[]> = this.auth.user$
    .pipe(concatMap(user => {
      return this.db.list(`${user.uid}/standardsGroups`,
        ref => ref.orderByChild('name'))
        .snapshotChanges()
        .pipe(map(snaps => 
          convertSnaps<StandardsGroup>(snaps))
        );
    }));
  
  standards$ : Observable<Standard[]> = this.auth.user$
    .pipe(concatMap(user => {
      return this.db.list(`${user.uid}/standards`,
        ref => ref.orderByChild('name'))
        .snapshotChanges()
        .pipe(map(snaps => 
          convertSnaps<Standard>(snaps))
        );
    }));

  public activeGroupAction = new BehaviorSubject<string>("");
  private activeGroupAction$ = this.activeGroupAction.asObservable();

  displayedStandardsGroups$ = combineLatest(
    [this.standardsGroups$,
    this.activeGroupAction$,
    this.standards$]
  ).pipe(map(([groups, activeID, standards]) => {
    let active;
    let displayedStandards = [];
    if (activeID) {
      active = groups.find(g => g.id == activeID);
      standards = standards.filter(s => s.group == activeID);
      for (let c of active.categories) {
        let catObj = {
          category : "",
          standards : [],
        }
        catObj.category = c;
        catObj.standards = standards.filter(s => s.category == c);
        displayedStandards.push(catObj);
      };
      let uncategorized = {
        category : "Uncategorized",
        standards : standards.filter(s => !active.categories.includes(s.category)),
      };
      displayedStandards.push(uncategorized);
    } else {
      active = null;
      standards = null;
    }
    return ({groups, active, displayedStandards})
  }));

  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService
  ) { }

  createStandardsGroup(group : Partial<StandardsGroup>) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsGroupRef = this.db.list(`${user.uid}/standardsGroups`);
        return from(standardsGroupRef.push(group));
      }));
  }

  updateStandardsGroup(group: Partial<StandardsGroup>, id: string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsGroupRef = this.db.object(`${user.uid}/standardsGroups/${id}`);
        return from(standardsGroupRef.update(group));
      }));
  }

  deleteStandardsGroup(group: StandardsGroup) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsGroupRef = this.db.object(`${user.uid}/standardsGroups/${group.id}`);
        return from(standardsGroupRef.remove());
      }));
  }

  createStandard(standard : Partial<Standard>) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsRef = this.db.list(`${user.uid}/standards`);
        return from(standardsRef.push(standard));
      }));
  }

  updateStandard(standard: Partial<Standard>, id: string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardRef = this.db.object(`${user.uid}/standards/${id}`);
        return from(standardRef.update(standard));
      }));
  }

  deleteStandard(standard: Standard) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsRef = this.db.object(`${user.uid}/standards/${standard.id}`);
        return from(standardsRef.remove());
      }));
  }
}
