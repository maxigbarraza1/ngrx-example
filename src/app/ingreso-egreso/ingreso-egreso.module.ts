import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgChartsModule } from 'ng2-charts';
import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrdenIngresosEgresosPipe } from '../pipes/orden-ingresos-egresos.pipe';
import { SharedModule } from '../shared/shared.module';
import { DetalleComponent } from './detalle/detalle.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { ingresoEgresoReducer } from './ingreso-egreso.reducer';

@NgModule({
  declarations: [
    DetalleComponent,
    EstadisticaComponent,
    IngresoEgresoComponent,
    DashboardComponent,
    OrdenIngresosEgresosPipe,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('ingresosEgresos', ingresoEgresoReducer),
    NgChartsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    DashboardRoutesModule,
  ],
})
export class IngresoEgresoModule {}
