import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  suscriptions!: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.suscriptions = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user !== null))
      .subscribe(({ user }) => {
        const subscription = this.ingresoEgresoService
          .initEgresosIngresosListener(user!.uid)
          .subscribe((ingresosEgresosFB) => {
            this.store.dispatch(
              ingresoEgresoActions.setItems({ items: ingresosEgresosFB })
            );
          });
        this.suscriptions.add(subscription);
      });
  }

  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
  }
}
