import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateValidator } from '@core/helpers/date-validator';
import { MANY_SERVICES_CONFIG } from '@shared/constants/service-config';
import { Button, ModalWrapper } from '@shared/ui';

@Component({
	selector: 'app-many-services-modal',
	templateUrl: './many-services-modal.html',
	styleUrl: './many-services-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button],
})
export class ManyServicesModal {
	visible = input.required<boolean>();

	closeModal = output();

	protected config = MANY_SERVICES_CONFIG;

	form = new FormGroup({
		odometer: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.odometer.min),
			Validators.maxLength(this.config.odometer.max),
		]),
		date: new FormControl('', [Validators.required, dateValidator]),
	});

	protected hasValidationError(formControl: keyof typeof this.form.controls): boolean {
		const control = this.form.controls[formControl];
		return !!(control?.touched && control?.invalid);
	}

	onFormatDate(): void {
		let value = this.form.controls.date.value || '';
		value = value.replace(/\D/g, '');

		if (value.length > 2) value = `${value.slice(0, 2)}.${value.slice(2)}`;
		if (value.length > 5) value = `${value.slice(0, 5)}.${value.slice(5)}`;

		this.form.controls.date.setValue(value, { emitEvent: false });
	}

	onSave(): void {
		this.onClose();
	}

	onClose(): void {
		this.form.reset();
		this.closeModal.emit();
	}
}
