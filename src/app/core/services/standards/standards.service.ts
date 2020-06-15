import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { Observable, from } from 'rxjs';
import { StandardsGroup } from '../../models/standards-group';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from '../db-utils';

@Injectable({
  providedIn: 'root'
})
export class StandardsService {
  standardsGroups$ : Observable<StandardsGroup[]> = this.auth.user$
    .pipe(concatMap(user => {
      return this.db.list(`${user.uid}/standards`,
        ref => ref.orderByChild('name'))
        .snapshotChanges()
        .pipe(map(snaps => 
          convertSnaps<StandardsGroup>(snaps))
        );
    }))  

  constructor(
    private db : AngularFireDatabase,
    private auth : AuthService
  ) { }

  createStandardsGroup(group : Partial<StandardsGroup>) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsGroupRef = this.db.list(`${user.uid}/standards`);
        return from(standardsGroupRef.push(group));
      }));
  }

  updateStandardsGroup(group: Partial<StandardsGroup>, id: string) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsGroupRef = this.db.object(`${user.uid}/standards/${id}`);
        return from(standardsGroupRef.update(group));
      }));
  }

  deleteStandardsGroup(group: StandardsGroup) : Observable<any> {
    return this.auth.user$
      .pipe(concatMap(user => {
        let standardsGroupRef = this.db.object(`${user.uid}/standards/${group.id}`);
        return from(standardsGroupRef.remove());
      }));
  }
}
