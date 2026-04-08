import { createActionGroup, props } from '@ngrx/store';
import { Car } from 'models/car';

export const GarageActions = createActionGroup({
	source: 'Garage',
	events: {
		'Load Cars': props<{ userId: string }>(),
		'Load Cars Success': props<{ cars: Car[] }>(),
		'Load Cars Failure': props<{ error: string }>(),
	},
});
