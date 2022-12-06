import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscriptions!: Subscription;
  private _localUser: User | null = null;

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  get user() {
    return { ...this._localUser };
  }

  initAuthListener() {
    this.fireAuth.authState.subscribe((fuser) => {
      if (fuser) {
        this.userSubscriptions = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = User.fromFirebase(firestoreUser);
            this._localUser = user;
            this.store.dispatch(authActions.setUser({ user: user }));
          });
      } else {
        this.userSubscriptions.unsubscribe();
        this._localUser = null;
        this.store.dispatch(authActions.unsetUser());
        this.store.dispatch(ingresoEgresoActions.clearItems());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string): Promise<any> {
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
