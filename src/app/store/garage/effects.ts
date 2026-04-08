import { Injectable, inject } from '@angular/core';
import { GarageService } from '@core/services/garage.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GarageActions } from './actions';

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

	addCar$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GarageActions.addCar),
			switchMap(({ car }) =>
				this.garageService.addCar(car).pipe(
					map((newCar) => GarageActions.addCarSuccess({ car: newCar })),
					catchError((err) => of(GarageActions.addCarFailure({ error: err.message }))),
				),
			),
		),
	);
}
