import { createReducer, on } from '@ngrx/store';
import { initialState } from './state';
import { CarInfoActions } from './actions';

export const carInfoReducer = createReducer(
	initialState,

	on(CarInfoActions.loadCarInfo, (state) => ({
		...state,
		error: null,
		loading: true,
	})),

	on(CarInfoActions.loadCarSuccess, (state, { carInfo }) => ({
		...state,
		carInfo,
		loading: false,
	})),

	on(CarInfoActions.loadCarFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
