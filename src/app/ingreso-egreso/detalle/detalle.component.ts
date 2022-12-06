import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];

  suscriptions!: Subscription;

  constructor(
    private store: Store<AppStateWithIngresoEgreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.suscriptions = this.store
      .select('ingresosEgresos')
      .subscribe((ingresoEgreso) => {
        this.ingresosEgresos = ingresoEgreso.items;
      });
  }

  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
  }

  removeItem(id: string) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(id)
      .then(() => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  }
}
