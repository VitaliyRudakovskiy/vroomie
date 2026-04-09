import { createActionGroup, props } from '@ngrx/store';
import type { Car, CarWithoutId } from 'models/car';

export const GarageActions = createActionGroup({
	source: 'Garage',
	events: {
		'Load Cars': props<{ userId: string }>(),
		'Load Cars Success': props<{ cars: Car[] }>(),
		'Load Cars Failure': props<{ error: string }>(),

		'Load Car Info': props<{ carid: string }>(),
		'Load Car Success': props<{ car: Car }>(),
		'Load Car Failure': props<{ error: string }>(),

		'Add Car': props<{ car: CarWithoutId }>(),
		'Add Car Success': props<{ car: Car }>(),
		'Add Car Failure': props<{ error: string }>(),
	},
});
