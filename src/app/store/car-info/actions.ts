import { createActionGroup, props } from '@ngrx/store';
import type { Car } from 'models/car';

export const CarInfoActions = createActionGroup({
	source: 'carInfo',
	events: {
		'Load Car Info': props<{ carId: string }>(),
		'Load Car Success': props<{ carInfo: Car }>(),
		'Load Car Failure': props<{ error: string }>(),
	},
});
