import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';
@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css'],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  ingresos: number = 0;
  egresos: number = 0;

  totalEgresos: number = 0;
  totalIngresos: number = 0;

  suscriptions!: Subscription;

  // Doughnut
  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIngresoEgreso>) {}

  ngOnInit(): void {
    this.suscriptions = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => {
        this.ingresos = 0;
        this.egresos = 0;
        this.totalEgresos = 0;
        this.totalIngresos = 0;
        this.generarEstadistica(items);
      });
  }

  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]) {
    for (const item of items) {
      if (item.type === 'ingreso') {
        this.totalIngresos += item.amount;
        this.ingresos++;
      } else {
        this.totalEgresos += item.amount;
        this.egresos++;
      }
    }
    this.doughnutChartData.datasets = [
      { data: [this.totalIngresos, this.totalEgresos] },
    ];
    this.chart?.chart?.update();
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
