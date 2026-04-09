import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { CarInfoState } from './types';

export const selectCarInfoState = createFeatureSelector<CarInfoState>('carInfo');

export const selectCarInfo = createSelector(
	selectCarInfoState,
	(state: CarInfoState) => state.carInfo,
);

export const selectCarInfoLoading = createSelector(
	selectCarInfoState,
	(state: CarInfoState) => state.loading,
);

export const selectError = createSelector(selectCarInfoState, (state: CarInfoState) => state.error);
