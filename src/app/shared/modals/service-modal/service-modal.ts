import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalWrapper, Button } from '@shared/ui';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { SERVICE_CONFIG } from '@shared/constants/service-config';

@Component({
	selector: 'app-service-modal',
	templateUrl: './service-modal.html',
	styleUrl: './service-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button, OnlyNumbersDirective],
})
export class ServiceModal {
	visible = input.required<boolean>();

	closeModal = output();

	protected config = SERVICE_CONFIG;

	serviceForm = new FormGroup({
		title: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.title.min),
			Validators.maxLength(this.config.title.max),
		]),
		notes: new FormControl(''),
		odometer: new FormControl('', [
			Validators.required,
			Validators.minLength(SERVICE_CONFIG.odometer.min),
			Validators.maxLength(SERVICE_CONFIG.odometer.max),
		]),
		date: new FormControl('', Validators.required),
	});

	protected hasValidationError(formControl: keyof typeof this.serviceForm.controls): boolean {
		const control = this.serviceForm.controls[formControl];
		return !!(control?.touched && control?.invalid);
	}

	onSave(): void {
		console.log(this.serviceForm.value);
	}

	onClose(): void {
		this.closeModal.emit();
	}

	onFormatDate(): void {
		let value = this.serviceForm.controls.date.value || '';
		value = value.replace(/\D/g, '');

		if (value.length > 2) value = value.slice(0, 2) + '.' + value.slice(2);

		if (value.length > 5) value = value.slice(0, 5) + '.' + value.slice(5);

		this.serviceForm.controls.date.setValue(value, { emitEvent: false });
	}
}
