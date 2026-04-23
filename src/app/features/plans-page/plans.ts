import { Component, inject, input, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button, Loader } from '@shared/ui';
import { CarInfoActions } from 'store/car-info/actions';
import { selectCarInfo } from 'store/car-info/selectors';
import { PlansActions } from 'store/plans/actions';
import { selectLoading, selectPlans } from 'store/plans/selectors';

@Component({
	selector: 'app-plans',
	templateUrl: './plans.html',
	styleUrl: './plans.scss',
	imports: [Button, Loader],
})
export class Plans implements OnInit {
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	carId = input.required<string>();

	plans = this.store.selectSignal(selectPlans);
	loading = this.store.selectSignal(selectLoading);
	carInfo = this.store.selectSignal(selectCarInfo);

	ngOnInit(): void {
		this.store.dispatch(PlansActions.loadPlans({ carId: this.carId() }));
		this.store.dispatch(CarInfoActions.loadCarInfo({ carId: this.carId() }));
	}

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}

	openPlanModal(): void {}
}
