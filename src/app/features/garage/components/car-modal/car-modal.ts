import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyNumbersDirective } from '@core/directives/onlyNumbers';
import { Store } from '@ngrx/store';
import { BODY_TYPES_LIST } from '@shared/constants/body-types';
import { Button } from '@shared/ui';
import { ModalWrapper } from '@shared/ui/modal-wrapper/modal-wrapper';
import type { CarWithoutId } from 'models/car';
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
	modalTitle = input.required<string>();
	userId = input('');

	confirm = output();
	closeModal = output();

	protected form = new FormGroup({
		make: new FormControl('', [Validators.required, Validators.maxLength(20)]),
		model: new FormControl('', [Validators.required, Validators.maxLength(50)]),
		year: new FormControl(null, Validators.required),
		bodyType: new FormControl('', Validators.required),
		vin: new FormControl('', [Validators.maxLength(17), Validators.maxLength(17)]),
		currentOdometer: new FormControl(null),
	});

	protected readonly bodyTypes = BODY_TYPES_LIST;

	onClose(): void {
		this.closeModal.emit();
	}

	onSave(): void {
		if (!this.userId()) {
			return;
		}

		const { make, model, year, bodyType, vin, currentOdometer } = this.form.value;
		if (!make || !model || !year || !bodyType || !vin || !currentOdometer) {
			return;
		}

		const car: CarWithoutId = {
			ownerId: this.userId(),
			make,
			model,
			year,
			bodyType,
			vin,
			currentOdometer,
			photoUrl: null,
			boughtDate: null,
			lastServiceDate: null,
			createdAt: Date.now(),
		};

		this.store.dispatch(GarageActions.addCar({ car }));
		this.onClose();
	}
}
