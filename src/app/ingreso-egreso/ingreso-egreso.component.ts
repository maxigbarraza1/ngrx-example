import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css'],
})
export class IngresoEgresoComponent implements OnInit {
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  isLoading: boolean = false;
  suscriptions!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {
    this.ingresoForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.suscriptions = this.store
      .select('ui')
      .subscribe((ui) => (this.isLoading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
  }

  submit() {
    if (this.ingresoForm.invalid) {
      this.ingresoForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(uiActions.isLoading());
    const { description, amount } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(description, amount, this.tipo);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((docRef) => {
        Swal.fire('Registro creado', ingresoEgreso.description, 'success');
        this.ingresoForm.reset();
      })
      .catch((err) => Swal.fire('Error', ingresoEgreso.description, 'error'))
      .finally(() => this.store.dispatch(uiActions.stopLoading()));
  }
}
