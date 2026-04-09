import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CarInfoActions } from './actions';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { CarinfoService } from '@core/services/car-info.service';

@Injectable({ providedIn: 'root' })
export class CarInfoEffects {
	private readonly actions$ = inject(Actions);
	private readonly carInfoService = inject(CarinfoService);

	loadCarInfo$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CarInfoActions.loadCarInfo),
			switchMap(({ carId }) =>
				this.carInfoService.getCarInfo(carId).pipe(
					take(1),
					map((carInfo) => CarInfoActions.loadCarSuccess({ carInfo })),
					catchError((error) => of(CarInfoActions.loadCarFailure({ error: error.message }))),
				),
			),
		),
	);
}
