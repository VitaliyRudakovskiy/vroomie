import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { GarageState } from './types';

export const selectGarageState = createFeatureSelector<GarageState>('garage');

export const selectCars = createSelector(selectGarageState, (state: GarageState) => state.cars);

export const selectLoading = createSelector(
	selectGarageState,
	(state: GarageState) => state.loading,
);

export const selectError = createSelector(selectGarageState, (state: GarageState) => state.error);
