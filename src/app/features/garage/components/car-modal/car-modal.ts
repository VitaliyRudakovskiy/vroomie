import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalWrapper } from '@shared/ui/modal-wrapper/modal-wrapper';
import { Button } from '@shared/ui';

@Component({
	selector: 'app-car-modal',
	templateUrl: './car-modal.html',
	styleUrl: './car-modal.scss',
	imports: [ModalWrapper, ReactiveFormsModule, Button],
})
export class CarModal {
	visible = input.required<boolean>();
	modalTitle = input.required<string>();

	confirm = output();
	closeModal = output();

	protected form = new FormGroup({
		make: new FormControl('', Validators.required),
		model: new FormControl('', Validators.required),
		year: new FormControl(null, Validators.required),
		vin: new FormControl('', [Validators.maxLength(17), Validators.maxLength(17)]),
		currentOdometer: new FormControl(null),
	});

	onClose(): void {
		this.closeModal.emit();
	}
}
