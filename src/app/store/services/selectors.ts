import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { ServicesState } from './types';

export const selectServicesState = createFeatureSelector<ServicesState>('services');

export const selectServices = createSelector(
	selectServicesState,
	(state: ServicesState) => state.services,
);

export const selectLoading = createSelector(
	selectServicesState,
	(state: ServicesState) => state.loading,
);

export const selectError = createSelector(
	selectServicesState,
	(state: ServicesState) => state.error,
);
