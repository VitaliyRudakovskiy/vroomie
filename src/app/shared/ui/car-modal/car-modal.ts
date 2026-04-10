import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { Store } from '@ngrx/store';
import { CAR_INFO_CONFIG } from '@shared/constants/car-info-config';
import { Button } from '@shared/ui';
import { ModalWrapper } from '@shared/ui/modal-wrapper/modal-wrapper';
import type { Car, CarFormOnly, CarWithoutId } from 'models/car';
import { GarageActions } from 'store/garage/actions';

@Component({
	selector: 'app-car-modal',
	templateUrl: './car-modal.html',
	styleUrl: './car-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button, OnlyNumbersDirective],
})
export class CarModal {
	private readonly store = inject(Store);

	visible = input.required<boolean>();
	userId = input.required<string>();
	selectedCar = input<Car | null>(null);

	confirm = output();
	closeModal = output();

	protected config = CAR_INFO_CONFIG;

	protected form = new FormGroup({
		make: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.make.min),
			Validators.maxLength(this.config.make.max),
		]),
		model: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.model.min),
			Validators.maxLength(this.config.model.max),
		]),
		currentOdometer: new FormControl<number | null>(null, [
			Validators.required,
			Validators.minLength(this.config.odometer.min),
			Validators.maxLength(this.config.odometer.max),
		]),
		vin: new FormControl('', [
			Validators.minLength(this.config.vin.min),
			Validators.maxLength(this.config.vin.max),
		]),
	});

	private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });
	private formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });

	protected isSubmitDisabled = computed(() => {
		if (this.formStatus() === 'INVALID') return true;

		const car = this.selectedCar();
		if (!car) return false;

		const current = this.formValue();
		const isChanged =
			current.make !== car.make ||
			current.model !== car.model ||
			current.currentOdometer !== car.currentOdometer ||
			current.vin !== car.vin;

		return !isChanged;
	});

	constructor() {
		effect(() => {
			const car = this.selectedCar();
			if (!car) return;

			const { make, model, vin, currentOdometer } = car;
			this.form.patchValue({ make, model, vin, currentOdometer });
		});
	}

	onClose(): void {
		this.closeModal.emit();
	}

	onSave(): void {
		if (this.form.invalid) return;

		const { make, model, vin, currentOdometer } = this.form.getRawValue();
		const selectedCar = this.selectedCar();

		if (!make || !model || !currentOdometer) return;

		const carData: CarFormOnly = {
			make,
			model,
			vin: vin ?? null,
			currentOdometer,
		};

		if (selectedCar) {
			this.store.dispatch(GarageActions.updateCar({ carId: selectedCar.id, car: carData }));
		} else {
			const newCar: CarWithoutId = {
				...carData,
				ownerId: this.userId(),
				photoUrl: null,
				createdAt: Date.now(),
			};

			this.store.dispatch(GarageActions.addCar({ car: newCar }));
		}

		this.onClose();
	}

	protected hasValidationError(formControl: keyof typeof this.form.controls): boolean {
		const control = this.form.controls[formControl];
		return !!(control?.touched && control?.invalid);
	}
}
