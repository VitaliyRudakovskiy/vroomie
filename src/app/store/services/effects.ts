import { Injectable, inject } from '@angular/core';
import { ServicesService } from '@core/services/services.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, take } from 'rxjs';
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
}
