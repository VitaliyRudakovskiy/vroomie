import { createActionGroup, props } from '@ngrx/store';
import type { Car, CarFormOnly, CarWithoutId } from 'models/car';

export const GarageActions = createActionGroup({
	source: 'Garage',
	events: {
		'Load Cars': props<{ userId: string }>(),
		'Load Cars Success': props<{ cars: Car[] }>(),
		'Load Cars Failure': props<{ error: string }>(),

		'Add Car': props<{ car: CarWithoutId }>(),
		'Add Car Success': props<{ car: Car }>(),
		'Add Car Failure': props<{ error: string }>(),

		'Delete Car': props<{ carId: string }>(),
		'Delete Car Success': props<{ carId: string }>(),
		'Delete Car Failure': props<{ error: string }>(),

		'Update Car': props<{ carId: string; car: CarFormOnly }>(),
		'Update Car Success': props<{ car: Car }>(),
		'Update Car Failure': props<{ error: string }>(),
	},
});
