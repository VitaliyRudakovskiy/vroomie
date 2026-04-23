import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { PlansState } from './types';

export const selectPlansState = createFeatureSelector<PlansState>('plans');

export const selectPlans = createSelector(selectPlansState, (state: PlansState) => state.plans);

export const selectLoading = createSelector(selectPlansState, (state: PlansState) => state.loading);

export const selectError = createSelector(selectPlansState, (state: PlansState) => state.error);
