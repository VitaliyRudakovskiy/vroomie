import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GarageActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { GarageService } from '@core/services/garage.service';

@Injectable({ providedIn: 'root' })
export class GarageEffects {
	private readonly actions$ = inject(Actions);
	private readonly garageService = inject(GarageService);

	loadCars$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GarageActions.loadCars),
			switchMap(({ userId }) =>
				this.garageService.getCarsByOwnerId(userId).pipe(
					map((cars) => GarageActions.loadCarsSuccess({ cars })),
					catchError((error) => of(GarageActions.loadCarsFailure({ error: error.message }))),
				),
			),
		),
	);
}
