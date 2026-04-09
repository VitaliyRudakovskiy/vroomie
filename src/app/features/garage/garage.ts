import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, Injector, inject, type OnInit, PLATFORM_ID, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserService } from '@core/services/user.service';
import { Store } from '@ngrx/store';
import { Button, Loader } from '@shared/ui';
import { filter } from 'rxjs';
import { GarageActions } from 'store/garage/actions';
import { selectCars, selectLoading } from 'store/garage/selectors';
import { Car } from './components/car/car';
import { CarModal } from './components/car-modal/car-modal';

@Component({
	selector: 'app-garage',
	templateUrl: './garage.html',
	styleUrl: './garage.scss',
	imports: [Button, CarModal, AsyncPipe, Loader, Car],
})
export class Garage implements OnInit {
	private readonly store = inject(Store);
	private readonly userService = inject(UserService);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly injector = inject(Injector);

	isCarModalOpen = signal(false);
	userProfile = this.userService.userProfile;

	readonly cars$ = this.store.select(selectCars);
	readonly loading$ = this.store.select(selectLoading);

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			toObservable(this.userProfile, { injector: this.injector })
				.pipe(filter((user) => !!user?.uid))
				.subscribe((user) => {
					if (user?.uid) {
						this.store.dispatch(GarageActions.loadCars({ userId: user.uid }));
					}
				});
		}
	}

	showCarModal(): void {
		this.isCarModalOpen.set(true);
	}

	closeCarModal(): void {
		this.isCarModalOpen.set(false);
	}
}
