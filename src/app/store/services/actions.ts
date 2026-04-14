import { createActionGroup, props } from '@ngrx/store';
import type { ServiceRecord } from 'models/service-record';

export const ServicesActions = createActionGroup({
	source: 'Services',
	events: {
		'Load Services': props<{ carId: string }>(),
		'Load Services Success': props<{ services: ServiceRecord[] }>(),
		'Load Services Failure': props<{ error: string }>(),
	},
});
