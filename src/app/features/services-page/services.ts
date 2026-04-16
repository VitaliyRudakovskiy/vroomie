import { Component, inject, input, type OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ServiceModal } from '@shared/modals';
import { Button, Loader } from '@shared/ui';
import { CarInfoActions } from 'store/car-info/actions';
import { selectCarInfo } from 'store/car-info/selectors';
import { ServicesActions } from 'store/services/actions';
import { selectLoading, selectServices } from 'store/services/selectors';
import { ServiceCard } from './components/service-card/service-card';

@Component({
	selector: 'app-services',
	templateUrl: './services.html',
	styleUrl: './services.scss',
	imports: [Button, Loader, ServiceModal, ServiceCard],
})
export class Services implements OnInit {
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	carId = input.required<string>();

	isServiceModalOpen = signal(false);

	services = this.store.selectSignal(selectServices);
	loading = this.store.selectSignal(selectLoading);
	carInfo = this.store.selectSignal(selectCarInfo);

	ngOnInit(): void {
		this.store.dispatch(ServicesActions.loadServices({ carId: this.carId() }));
		this.store.dispatch(CarInfoActions.loadCarInfo({ carId: this.carId() }));
	}

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}

	openServiceModal(): void {
		this.isServiceModalOpen.set(true);
	}

	closeServiceModal(): void {
		this.isServiceModalOpen.set(false);
	}
}
