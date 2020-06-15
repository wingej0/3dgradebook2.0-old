import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';
import 'firebase/auth';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ : Observable<User> = this.afAuth.authState
      .pipe(switchMap(user => {
        if (user) {
          return this.db.object(`${user.uid}/user`).valueChanges();
        } else {
          return of(null);
        }
      }));

  constructor(
    private afAuth : AngularFireAuth,
    private db : AngularFireDatabase,
    private router : Router
  ) { }

   async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.updateUserData(credential.user); 
    return this.router.navigate(['/dashboard']);
   }

   async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

   private updateUserData({ uid, email, displayName, photoURL } : User) {
     const userRef = this.db.object(`${uid}/user`);
     
     const data = {
       uid,
       email,
       displayName,
       photoURL
     };

     return userRef.update(data);
   }
}
