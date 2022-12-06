import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUserName: string = '';
  suscriptions!: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.currentUserName = user?.name || '';
      });
  }

  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
  }
}
