import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const setItems = createAction(
  '[Ingreso Egreso] Set Items',
  props<{ items: IngresoEgreso[] }>()
);
export const clearItems = createAction('[Ingreso Egreso] Clear Items');
