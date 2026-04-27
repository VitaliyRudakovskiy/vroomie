import { Injectable, inject } from '@angular/core';
import { GarageService } from '@core/services/garage.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import type { Car } from 'models/car';
import { catchError, exhaustMap, map, of, switchMap, take } from 'rxjs';
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
					take(1),
					map((cars) => GarageActions.loadCarsSuccess({ cars })),
					catchError((error) => of(GarageActions.loadCarsFailure({ error: error.message }))),
				),
			),
		),
	);

	addCar$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GarageActions.addCar),
			exhaustMap(({ car }) =>
				this.garageService.addCar(car).pipe(
					map((newCar) => GarageActions.addCarSuccess({ car: newCar })),
					catchError((err) => of(GarageActions.addCarFailure({ error: err.message }))),
				),
			),
		),
	);

	deleteCar$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GarageActions.deleteCar),
			exhaustMap(({ carId }) =>
				this.garageService.deleteCar(carId).pipe(
					map(() => GarageActions.deleteCarSuccess({ carId })),
					catchError((error) => of(GarageActions.deleteCarFailure({ error: error.message }))),
				),
			),
		),
	);

	updateCar$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GarageActions.updateCar),
			exhaustMap(({ carId, car }) =>
				this.garageService.updateCar(carId, car).pipe(
					map(() => GarageActions.updateCarSuccess({ car: { ...car, id: carId } as Car })),
					catchError((error) => of(GarageActions.updateCarFailure({ error: error.message }))),
				),
			),
		),
	);
}
