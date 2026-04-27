import { createReducer, on } from '@ngrx/store';
import { GarageActions } from 'store/garage/actions';
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
		services: [service, ...state.services],
		loading: false,
	})),

	on(ServicesActions.addServiceFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),

	on(ServicesActions.deleteService, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(ServicesActions.deleteServiceSuccess, (state, { serviceId }) => ({
		...state,
		services: state.services.filter((service) => service.id !== serviceId),
		loading: false,
	})),

	on(ServicesActions.deleteServiceFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),

	// при удалении машины удаляем все сервисы, связанные с этой машиной
	on(GarageActions.deleteCarSuccess, (state, { carId }) => ({
		...state,
		services: state.services.filter((service) => service.carId !== carId),
		loading: false,
	})),
);
