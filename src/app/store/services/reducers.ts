import { createReducer, on } from '@ngrx/store';
import { ServicesActions } from './actions';
import { initialState } from './state';

export const servicesReducer = createReducer(
	initialState,

	on(ServicesActions.loadServices, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(ServicesActions.loadServicesSuccess, (state, { services }) => ({
		...state,
		services,
		loading: false,
	})),

	on(ServicesActions.loadServicesFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),

	on(ServicesActions.addService, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(ServicesActions.addServiceSuccess, (state, { service }) => ({
		...state,
		services: [...state.services, service],
		loading: false,
	})),

	on(ServicesActions.addServiceFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
