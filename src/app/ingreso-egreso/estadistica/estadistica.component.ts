import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css'],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;

  totalEgresos: number = 0;
  totalIngresos: number = 0;

  suscriptions!: Subscription;

  // Doughnut
  public doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [350, 450, 100] },
      { data: [50, 150, 120] },
      { data: [250, 130, 70] },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.suscriptions = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => this.generarEstadistica(items));
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
