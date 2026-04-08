import { createReducer, on } from '@ngrx/store';
import { initialState } from './state';
import { GarageActions } from './actions';

export const garageReducer = createReducer(
	initialState,

	on(GarageActions.loadCars, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(GarageActions.loadCarsSuccess, (state, { cars }) => ({
		...state,
		cars,
		loading: false,
	})),

	on(GarageActions.loadCarsFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
