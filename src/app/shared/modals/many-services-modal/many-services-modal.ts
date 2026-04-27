import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { dateValidator } from '@core/helpers/date-validator';
import { hasValidationError } from '@core/helpers/has-validation-error';
import { UserService } from '@core/services/user.service';
import { Store } from '@ngrx/store';
import { MANY_SERVICES_CONFIG } from '@shared/constants/service-config';
import { Button, ModalWrapper } from '@shared/ui';
import type { Car } from 'models/car';
import type { ServiceRecordWithoutId } from 'models/service-record';
import { ServicesActions } from 'store/services/actions';
import { ConfirmModal } from '../confirm-modal';

@Component({
	selector: 'app-many-services-modal',
	templateUrl: './many-services-modal.html',
	styleUrl: './many-services-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button, ConfirmModal, OnlyNumbersDirective],
})
export class ManyServicesModal {
	private readonly userService = inject(UserService);
	private readonly store = inject(Store);

	visible = input.required<boolean>();
	carId = input.required<string>();
	carInfo = input.required<Car>();

	closeModal = output();

	serviceList = signal<string[]>([]);
	isConfirmCloseModalOpen = signal(false);

	protected config = MANY_SERVICES_CONFIG;

	form = new FormGroup({
		odometer: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.odometer.min),
			Validators.maxLength(this.config.odometer.max),
		]),
		date: new FormControl('', [Validators.required, dateValidator]),
		title: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.title.min),
			Validators.maxLength(this.config.title.max),
		]),
	});

	protected hasError(control: keyof typeof this.form.controls) {
		return hasValidationError(this.form, control);
	}

	protected isAddDisabled(): boolean {
		const odometerValid = this.form.controls.odometer.valid;
		const dateValid = this.form.controls.date.valid;
		const titleValid = this.form.controls.title.valid;
		const hasServices = this.serviceList().length > 0;

		return !(odometerValid && dateValid && (titleValid || hasServices));
	}

	onSave(): void {
		const list = [...this.serviceList()];
		const { title, odometer, date } = this.form.value;
		if (!odometer || !date) return;

		if (title?.trim()) list.push(title.trim());
		if (list.length === 0) return;

		const [day, month, year] = date.split('.').map(Number);
		const ms = new Date(year, month - 1, day).getTime();

		const commonData = {
			carId: this.carId(),
			odometer: Number(odometer),
			make: this.carInfo()?.make ?? '',
			model: this.carInfo()?.model ?? '',
			date: ms,
			ownerId: this.userService.userProfile()?.uid || '',
			photoUrls: null,
			createdAt: Date.now(),
		};

		for (const serviceTitle of list) {
			const newService: ServiceRecordWithoutId = {
				...commonData,
				title: serviceTitle,
				notes: '',
			};

			this.store.dispatch(ServicesActions.addService({ service: newService }));
		}

		this.resetAndClose();
	}

	onFormatDate(): void {
		let value = this.form.controls.date.value || '';
		value = value.replace(/\D/g, '');

		if (value.length > 2) value = `${value.slice(0, 2)}.${value.slice(2)}`;
		if (value.length > 5) value = `${value.slice(0, 5)}.${value.slice(5)}`;

		this.form.controls.date.setValue(value, { emitEvent: false });
	}

	addNewService(): void {
		const service = this.form.value.title?.trim();
		if (!service) return;

		this.serviceList.update((list) => [...list, service]);
		this.form.controls.title.setValue('', { emitEvent: false });
		this.form.controls.title.markAsUntouched();
	}

	openConfirmCloseModal(): void {
		this.isConfirmCloseModalOpen.set(true);
	}

	closeConfirmCloseModal(): void {
		this.isConfirmCloseModalOpen.set(false);
	}

	onClose(): void {
		if (this.serviceList().length > 0) {
			this.openConfirmCloseModal();
			return;
		}

		this.onConfirmCloseServiceModal();
	}

	onConfirmCloseServiceModal(): void {
		if (this.isConfirmCloseModalOpen()) this.closeConfirmCloseModal();
		this.resetAndClose();
	}

	private resetAndClose(): void {
		this.form.reset();
		this.serviceList.set([]);
		this.closeModal.emit();
	}
}
