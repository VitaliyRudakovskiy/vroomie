import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from '@shared/ui';
import { selectCarInfo } from 'store/car-info/selectors';

@Component({
	selector: 'app-plans',
	templateUrl: './plans.html',
	styleUrl: './plans.scss',
	imports: [Button],
})
export class Plans {
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	carId = input.required<string>();
	carInfo = this.store.selectSignal(selectCarInfo);

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}

	openPlanModal(): void {}
}
