import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasValidationError } from '@core/helpers/has-validation-error';
import { UserService } from '@core/services/user.service';
import { Store } from '@ngrx/store';
import { PLAN_CONFIG } from '@shared/constants/plan-config';
import { Button, ModalWrapper } from '@shared/ui';
import type { Car } from 'models/car';
import type { PlanWithoutId, PriorityLevel } from 'models/plan';
import { PlansActions } from 'store/plans/actions';
import { PriorityPickerComponent } from './components/priority-picker/priority-picker';

@Component({
	selector: 'app-plan-modal',
	templateUrl: './plan-modal.html',
	imports: [ModalWrapper, Button, ReactiveFormsModule, PriorityPickerComponent],
})
export class PlanModalComponent {
	private readonly store = inject(Store);
	private readonly userService = inject(UserService);

	visible = input.required<boolean>();
	carId = input.required<string>();
	carInfo = input.required<Car>();

	closeModal = output();

	currentUser = this.userService.userProfile;

	protected readonly config = PLAN_CONFIG;

	planForm = new FormGroup({
		title: new FormControl('', [
			Validators.required,
			Validators.minLength(this.config.title.min),
			Validators.maxLength(this.config.title.max),
		]),
		notes: new FormControl(''),
		priority: new FormControl<PriorityLevel>(0),
	});

	onSave(): void {
		if (this.planForm.invalid) return;

		const { title, notes, priority } = this.planForm.value;
		if (!title) return;

		const newPlan: PlanWithoutId = {
			title,
			notes: notes ?? '',
			carId: this.carId(),
			ownerId: this.currentUser()?.uid || '',
			make: this.carInfo()?.make ?? '',
			model: this.carInfo()?.model ?? '',
			priority: priority ?? 0,
			photoUrls: null,
			createdAt: Date.now(),
		};

		this.store.dispatch(PlansActions.addPlan({ plan: newPlan }));
		this.onClose();
	}

	onClose(): void {
		this.planForm.reset();
		this.closeModal.emit();
	}

	protected hasError(control: keyof typeof this.planForm.controls) {
		return hasValidationError(this.planForm, control);
	}
}
