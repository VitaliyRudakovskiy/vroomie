import { createReducer, on } from '@ngrx/store';
import { PlansActions } from './actions';
import { initialState } from './state';

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

	on(PlansActions.addPlan, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(PlansActions.addPlanSuccess, (state, { plan }) => ({
		...state,
		plans: [plan, ...state.plans],
		loading: false,
	})),

	on(PlansActions.addPlanFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),

	on(PlansActions.deletePlan, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(PlansActions.deletePlanSuccess, (state, { planId }) => ({
		...state,
		plans: state.plans.filter((plan) => plan.id !== planId),
		loading: false,
	})),

	on(PlansActions.deletePlanFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
