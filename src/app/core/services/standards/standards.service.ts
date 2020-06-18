import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Observable, from, BehaviorSubject, combineLatest } from 'rxjs';
import { StandardsGroup } from '../../models/standards-group';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';
import { Standard } from '../../models/standard';

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
    activeID ? active = groups.find(g => g.id == activeID) : null;
    activeID ? standards = standards.filter(s => s.group == activeID) : standards = null;
    return ({groups, active, standards})
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
}
