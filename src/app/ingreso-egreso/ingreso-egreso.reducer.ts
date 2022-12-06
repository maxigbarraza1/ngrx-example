import { Action, createReducer, on } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { clearItems, setItems } from './ingreso-egreso.actions';

export interface State {
  items: IngresoEgreso[];
}

export const initialState: State = {
  items: [],
};

const _ingresoEgresoReducer = createReducer(
  initialState,

  on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(clearItems, (state) => ({ ...state, items: [] }))
);

export function ingresoEgresoReducer(state: any, action: Action) {
  return _ingresoEgresoReducer(state, action);
}
