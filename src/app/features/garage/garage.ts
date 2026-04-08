import { Component, effect, inject, signal } from '@angular/core';
import { Button, Card } from '@shared/ui';
import { CarModal } from './components/car-modal/car-modal';
import { Store } from '@ngrx/store';
import { selectCars, selectLoading } from 'store/garage/selectors';
import { GarageActions } from 'store/garage/actions';
import { UserService } from '@core/services/user.service';

@Component({
	selector: 'app-garage',
	templateUrl: './garage.html',
	styleUrl: './garage.scss',
	imports: [Button, Card, CarModal],
})
export class Garage {
	private readonly store = inject(Store);
	private readonly userService = inject(UserService);

	isCarModalOpen = signal(false);
	userProfile = this.userService.userProfile;

	readonly cars$ = this.store.select(selectCars);
	readonly loading$ = this.store.select(selectLoading);

	constructor() {
		effect(() => {
			const user = this.userProfile();
			if (user?.uid) {
				this.store.dispatch(GarageActions.loadCars({ userId: user.uid }));
			}
		});
	}

	showCarModal(): void {
		this.isCarModalOpen.set(true);
	}

	closeCarModal(): void {
		this.isCarModalOpen.set(false);
	}
}
