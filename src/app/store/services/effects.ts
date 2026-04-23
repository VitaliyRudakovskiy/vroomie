import { Injectable, inject } from '@angular/core';
import { ServicesService } from '@core/services/services.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, take } from 'rxjs';
import { ServicesActions } from './actions';

@Injectable({ providedIn: 'root' })
export class ServicesEffects {
	private readonly actions$ = inject(Actions);
	private readonly servicesService = inject(ServicesService);

	loadServices$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ServicesActions.loadServices),
			switchMap(({ carId }) =>
				this.servicesService.getServicesByCarId(carId).pipe(
					take(1),
					map((services) => ServicesActions.loadServicesSuccess({ services })),
					catchError((err) => of(ServicesActions.loadServicesFailure({ error: err.message }))),
				),
			),
		),
	);

	addService$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ServicesActions.addService),
			mergeMap(({ service }) =>
				this.servicesService.addService(service).pipe(
					map((newService) => ServicesActions.addServiceSuccess({ service: newService })),
					catchError((err) => of(ServicesActions.addServiceFailure({ error: err.message }))),
				),
			),
		),
	);

	deleteService$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ServicesActions.deleteService),
			mergeMap(({ serviceId }) =>
				this.servicesService.deleteService(serviceId).pipe(
					map(() => ServicesActions.deleteServiceSuccess({ serviceId })),
					catchError((err) => of(ServicesActions.deleteServiceFailure({ error: err.message }))),
				),
			),
		),
	);
}
