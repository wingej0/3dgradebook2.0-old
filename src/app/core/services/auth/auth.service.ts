import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Firebase imports
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';
import 'firebase/auth';

// RXJS and Models
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // User observable to be accessed in nav bar using async pipe and in calls to the database
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

  // Google sign in function (https://github.com/angular/angularfire/blob/master/docs/auth/getting-started.md) 
  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.updateUserData(credential.user); 
    return this.router.navigate(['/dashboard']);
  }

  // Sign out function (https://github.com/angular/angularfire/blob/master/docs/auth/getting-started.md)
  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  // Function to update user data from returned Google login object
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
