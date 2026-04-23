import { Injectable, inject } from '@angular/core';
import { PlansService } from '@core/services/plans.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { PlansActions } from './actions';

@Injectable({ providedIn: 'root' })
export class PlansEffects {
	private readonly actions$ = inject(Actions);
	private readonly plansService = inject(PlansService);

	loadPlans$ = createEffect(() =>
		this.actions$.pipe(
			ofType(PlansActions.loadPlans),
			switchMap(({ carId }) =>
				this.plansService.getPlansByCarId(carId).pipe(
					take(1),
					map((plans) => PlansActions.loadPlansSuccess({ plans })),
					catchError((err) => of(PlansActions.loadPlansFailure({ error: err.message }))),
				),
			),
		),
	);
}
