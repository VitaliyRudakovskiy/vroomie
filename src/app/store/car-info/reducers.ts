import { createReducer, on } from '@ngrx/store';
import { GarageActions } from 'store/garage/actions';
import { CarInfoActions } from './actions';
import { initialState } from './state';

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

	on(GarageActions.updateCarSuccess, (state, { car }) => ({
		...state,
		carInfo: car,
		loading: false,
	})),
);
