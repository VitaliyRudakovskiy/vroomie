import { Component, effect, inject, signal } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { Store } from '@ngrx/store';
import { CarModal } from '@shared/modals';
import { Button, Loader } from '@shared/ui';
import { ProfileButton } from '@shared/ui/profile-button/profile-button';
import { GarageActions } from 'store/garage/actions';
import { selectCars, selectLoading } from 'store/garage/selectors';
import { Car } from './components/car/car';

@Component({
	selector: 'app-garage',
	templateUrl: './garage.html',
	styleUrl: './garage.scss',
	imports: [Button, CarModal, Loader, Car, ProfileButton],
})
export class Garage {
	private readonly store = inject(Store);
	private readonly userService = inject(UserService);

	isCarModalOpen = signal(false);
	userProfile = this.userService.userProfile;

	readonly cars = this.store.selectSignal(selectCars);
	readonly loading = this.store.selectSignal(selectLoading);

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
