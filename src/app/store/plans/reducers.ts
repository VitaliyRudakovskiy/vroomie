import { createReducer, on } from '@ngrx/store';
import { initialState } from './state';
import { PlansActions } from './actions';

export const plansReducer = createReducer(
	initialState,

	on(PlansActions.loadPlans, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(PlansActions.loadPlansSuccess, (state, { plans }) => ({
		...state,
		plans,
		loading: false,
	})),

	on(PlansActions.loadPlansFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
