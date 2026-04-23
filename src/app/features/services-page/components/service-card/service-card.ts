import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Card } from '@shared/ui';
import type { ServiceRecord } from 'models/service-record';
import { ConfirmModal } from '@shared/modals';
import { Store } from '@ngrx/store';
import { selectLoading } from 'store/services/selectors';
import { ServicesActions } from 'store/services/actions';

@Component({
	selector: 'app-service-card',
	templateUrl: './service-card.html',
	styleUrl: './service-card.scss',
	imports: [Card, DatePipe, ConfirmModal],
})
export class ServiceCard {
	private readonly store = inject(Store);

	serviceInfo = input.required<ServiceRecord>();

	isConfirmModalOpen = signal(false);
	deleteLoading = this.store.selectSignal(selectLoading);

	convertDate(dateMs: number): Date {
		return new Date(dateMs);
	}

	clickCard(): void {}

	openConfirmDeleteModal(): void {
		this.isConfirmModalOpen.set(true);
	}

	closeConfirmDeleteModal(): void {
		this.isConfirmModalOpen.set(false);
	}

	deleteCard(): void {
		const serviceId = this.serviceInfo().id;
		if (!serviceId) return;

		this.store.dispatch(ServicesActions.deleteService({ serviceId }));
	}
}
