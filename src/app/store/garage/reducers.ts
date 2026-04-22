import { createReducer, on } from '@ngrx/store';
import { GarageActions } from './actions';
import { initialState } from './state';

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

	on(GarageActions.addCar, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(GarageActions.addCarSuccess, (state, { car }) => ({
		...state,
		cars: [car, ...state.cars],
		loading: false,
	})),

	on(GarageActions.addCarFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),

	on(GarageActions.updateCar, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(GarageActions.updateCarSuccess, (state, { car }) => ({
		...state,
		cars: state.cars.map((c) => (c.id === car.id ? car : c)),
		loading: false,
	})),

	on(GarageActions.updateCarFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
