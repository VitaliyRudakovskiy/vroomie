import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmModal } from '@shared/modals';
import { Card } from '@shared/ui';
import type { Car as TCar } from 'models/car';
import { GarageActions } from 'store/garage/actions';
import { selectLoading } from 'store/garage/selectors';

@Component({
	selector: 'app-car',
	templateUrl: './car.html',
	styleUrl: './car.scss',
	imports: [Card, ConfirmModal],
})
export class Car {
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	car = input.required<TCar>();

	isDeleteModalOpen = signal(false);
	deleteLoading = this.store.selectSignal(selectLoading);

	clickCard(): void {
		const id = this.car().id;
		if (!id) return;

		this.router.navigate([id], { relativeTo: this.route });
	}

	openConfirmDeleteModal(event: Event): void {
		event.stopPropagation();
		this.isDeleteModalOpen.set(true);
	}

	closeConfirmDeleteModal(): void {
		this.isDeleteModalOpen.set(false);
	}

	deleteCar(): void {
		const carId = this.car().id;
		if (!carId) return;

		this.store.dispatch(GarageActions.deleteCar({ carId }));
	}
}
