import { createActionGroup, props } from '@ngrx/store';
import { Plan } from 'models/plan';

export const PlansActions = createActionGroup({
	source: 'Plans',
	events: {
		'Load Plans': props<{ carId: string }>(),
		'Load Plans Success': props<{ plans: Plan[] }>(),
		'Load Plans Failure': props<{ error: string }>(),
	},
});
