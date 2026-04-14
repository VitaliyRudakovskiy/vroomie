import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { Store } from '@ngrx/store';
import { CAR_INFO_CONFIG } from '@shared/constants/car-info-config';
import { AutocompleteDropdown, Button } from '@shared/ui';
import { ModalWrapper } from '@shared/ui/modal-wrapper/modal-wrapper';
import type { Car, CarFormOnly, CarWithoutId } from 'models/car';
import { GarageActions } from 'store/garage/actions';

@Component({
	selector: 'app-car-modal',
	templateUrl: './car-modal.html',
	styleUrl: './car-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button, OnlyNumbersDirective, AutocompleteDropdown],
})
export class CarModal {
	private readonly store = inject(Store);

	visible = input.required<boolean>();
	userId = input.required<string>();
	selectedCar = input<Car | null>(null);

	confirm = output();
	closeModal = output();

	isMakeDropdownOpen = signal(false);

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
	makeSearchTerm = toSignal(this.form.controls.make.valueChanges, { initialValue: '' });

	protected isSubmitDisabled = computed(() => {
		if (this.formStatus() === 'INVALID') return true;

		const car = this.selectedCar();
		if (!car) return false;

		const current = this.formValue();

		const isMakeChanged = current.make?.trim() !== car.make?.trim();
		const isModelChanged = current.model?.trim() !== car.model?.trim();
		const isOdometerChanged = Number(current.currentOdometer) !== Number(car.currentOdometer);

		const currentVin = current.vin?.trim() || null;
		const carVin = car.vin?.trim() || null;
		const isVinChanged = currentVin !== carVin;

		const isChanged = isMakeChanged || isModelChanged || isOdometerChanged || isVinChanged;
		return !isChanged;
	});

	constructor() {
		effect(() => {
			const car = this.selectedCar();
			if (!car) return;

			const { make, model, vin, currentOdometer } = car;
			this.form.patchValue({ make, model, vin, currentOdometer });
		});

		this.form.controls.make.valueChanges.subscribe((val) => {
			const searchTerm = val || '';

			if (searchTerm.trim().length > 0 && this.form.controls.make.dirty)
				this.isMakeDropdownOpen.set(true);
			else this.isMakeDropdownOpen.set(false);
		});
	}

	selectMake(make: string) {
		this.form.controls.make.setValue(make, { emitEvent: false });
		this.isMakeDropdownOpen.set(false);
	}

	onClose(): void {
		this.resetForm();
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

	private resetForm() {
		const carInfo = this.selectedCar();

		if (carInfo) {
			const { make, model, vin, currentOdometer } = carInfo;
			this.form.patchValue({ make, model, vin, currentOdometer });
		} else {
			this.form.reset();
		}
	}
}
