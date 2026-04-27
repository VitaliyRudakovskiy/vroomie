import { Component, inject, input, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button, Loader } from '@shared/ui';
import { ProfileButton } from '@shared/ui/profile-button/profile-button';
import { CarInfoActions } from 'store/car-info/actions';
import { selectCarInfo, selectCarInfoLoading } from 'store/car-info/selectors';
import { GeneralInfo } from './components/general-info/general-info';

@Component({
	selector: 'app-car-info',
	templateUrl: './car-info.html',
	styleUrl: './car-info.scss',
	imports: [Loader, Button, GeneralInfo, ProfileButton],
})
export class CarInfo implements OnInit {
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	carId = input.required<string>();

	loading = this.store.selectSignal(selectCarInfoLoading);
	carInfo = this.store.selectSignal(selectCarInfo);

	ngOnInit(): void {
		this.store.dispatch(CarInfoActions.loadCarInfo({ carId: this.carId() }));
	}

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}

	goToPlans(): void {
		this.router.navigate(['plans'], { relativeTo: this.route });
	}

	goToServices(): void {
		this.router.navigate(['services'], { relativeTo: this.route });
	}
}
