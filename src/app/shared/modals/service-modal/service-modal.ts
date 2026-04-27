import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { dateValidator } from '@core/helpers/date-validator';
import { hasValidationError } from '@core/helpers/has-validation-error';
import { UserService } from '@core/services/user.service';
import { Store } from '@ngrx/store';
import { SERVICE_CONFIG } from '@shared/constants/service-config';
import { Button, ModalWrapper } from '@shared/ui';
import type { Car } from 'models/car';
import type { ServiceRecordWithoutId } from 'models/service-record';
import { ServicesActions } from 'store/services/actions';

@Component({
	selector: 'app-service-modal',
	templateUrl: './service-modal.html',
	imports: [ModalWrapper, ReactiveFormsModule, Button, OnlyNumbersDirective],
})
export class ServiceModal {
	private readonly store = inject(Store);
	private readonly userService = inject(UserService);

	visible = input.required<boolean>();
	carId = input.required<string>();
	carInfo = input.required<Car>();

	closeModal = output();

	currentUser = this.userService.userProfile;

	protected readonly config = SERVICE_CONFIG;

	serviceForm = new FormGroup({
		title: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.title.min),
			Validators.maxLength(this.config.title.max),
		]),
		notes: new FormControl(''),
		odometer: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.odometer.min),
			Validators.maxLength(this.config.odometer.max),
		]),
		date: new FormControl('', [Validators.required, dateValidator]),
	});

	protected hasError(control: keyof typeof this.serviceForm.controls) {
		return hasValidationError(this.serviceForm, control);
	}

	onSave(): void {
		if (this.serviceForm.invalid) return;

		const { title, notes, odometer, date } = this.serviceForm.value;
		if (!title || !odometer || !date) return;

		const [day, month, year] = date.split('.').map(Number);
		const ms = new Date(year, month - 1, day).getTime();

		const newService: ServiceRecordWithoutId = {
			title,
			notes: notes ?? '',
			carId: this.carId(),
			odometer: Number(odometer),
			make: this.carInfo()?.make ?? '',
			model: this.carInfo()?.model ?? '',
			date: ms,
			ownerId: this.currentUser()?.uid || '',
			photoUrls: null,
			createdAt: Date.now(),
		};

		this.store.dispatch(ServicesActions.addService({ service: newService }));
		this.onClose();
	}

	onClose(): void {
		this.serviceForm.reset();
		this.closeModal.emit();
	}

	onFormatDate(): void {
		let value = this.serviceForm.controls.date.value || '';
		value = value.replace(/\D/g, '');

		if (value.length > 2) value = `${value.slice(0, 2)}.${value.slice(2)}`;
		if (value.length > 5) value = `${value.slice(0, 5)}.${value.slice(5)}`;

		this.serviceForm.controls.date.setValue(value, { emitEvent: false });
	}
}
