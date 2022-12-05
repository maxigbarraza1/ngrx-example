import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscriptions!: Subscription;

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.fireAuth.authState.subscribe((fuser) => {
      if (fuser) {
        this.userSubscriptions = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = User.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user: user }));
          });
      } else {
        this.userSubscriptions.unsubscribe();
        this.store.dispatch(authActions.unsetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string): Promise<any> {
    console.log(nombre, email, password);
    return this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user!.uid, nombre, email);
        return this.firestore.doc(`${user!.uid}/usuario`).set({ ...newUser });
      });
  }

  login(email: string, password: string): Promise<any> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.fireAuth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.fireAuth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
