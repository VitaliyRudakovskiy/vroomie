import { createActionGroup, props } from '@ngrx/store';
import type { Plan, PlanWithoutId } from 'models/plan';

export const PlansActions = createActionGroup({
	source: 'Plans',
	events: {
		'Load Plans': props<{ carId: string }>(),
		'Load Plans Success': props<{ plans: Plan[] }>(),
		'Load Plans Failure': props<{ error: string }>(),

		'Add Plan': props<{ plan: PlanWithoutId }>(),
		'Add Plan Success': props<{ plan: Plan }>(),
		'Add Plan Failure': props<{ error: string }>(),

		'Delete Plan': props<{ planId: string }>(),
		'Delete Plan Success': props<{ planId: string }>(),
		'Delete Plan Failure': props<{ error: string }>(),
	},
});
