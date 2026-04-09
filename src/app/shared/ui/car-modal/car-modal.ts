import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { Store } from '@ngrx/store';
import { CAR_INFO_CONFIG } from '@shared/constants/car-info-config';
import { Button } from '@shared/ui';
import { ModalWrapper } from '@shared/ui/modal-wrapper/modal-wrapper';
import type { Car, CarWithoutId } from 'models/car';
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
		vin: new FormControl('', [
			Validators.minLength(this.config.vin.min),
			Validators.maxLength(this.config.vin.max),
		]),
		currentOdometer: new FormControl<number | null>(null, [
			Validators.minLength(this.config.odometer.min),
			Validators.maxLength(this.config.odometer.max),
		]),
	});

	private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });
	private formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });

	protected isSubmitDisabled = computed(() => {
		if (this.formStatus() === 'INVALID') {
			return true;
		}

		const car = this.selectedCar();
		if (!car) {
			return false;
		}

		const current = this.formValue();
		const isChanged =
			current.make !== car.make ||
			current.model !== car.model ||
			current.vin !== car.vin ||
			current.currentOdometer !== car.currentOdometer;

		return !isChanged;
	});

	constructor() {
		effect(() => {
			if (this.selectedCar()) {
				const { make, model, vin, currentOdometer } = this.selectedCar()!;
				this.form.patchValue({ make, model, vin, currentOdometer });
			}
		});
	}

	onClose(): void {
		this.closeModal.emit();
	}

	onSave(): void {
		const { make, model, vin, currentOdometer } = this.form.value;
		if (!make || !model || !vin || !currentOdometer) {
			return;
		}

		const car: CarWithoutId = {
			ownerId: this.userId(),
			make,
			model,
			vin,
			currentOdometer,
			photoUrl: null,
			createdAt: Date.now(),
		};

		this.store.dispatch(GarageActions.addCar({ car }));
		this.onClose();
	}
}
