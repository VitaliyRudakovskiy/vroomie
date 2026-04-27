import { Component, computed, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmModal } from '@shared/modals';
import { PRIORITY_OPTIONS } from '@shared/modals/plan-modal/components/priority-picker/options';
import { Card } from '@shared/ui';
import type { Plan } from 'models/plan';
import { PlansActions } from 'store/plans/actions';
import { selectLoading } from 'store/plans/selectors';

@Component({
	selector: 'app-plan-card',
	templateUrl: './plan-card.html',
	styleUrl: './plan-card.scss',
	imports: [Card, ConfirmModal],
})
export class PlanCard {
	private readonly store = inject(Store);

	plan = input.required<Plan>();

	isDeleteModalOpen = signal(false);
	deleteLoading = this.store.selectSignal(selectLoading);

	priority = computed(() => {
		const priorityValue = this.plan().priority;
		return {
			class: `priority-${priorityValue}`,
			label: PRIORITY_OPTIONS[priorityValue].label.split(' ')[0],
		};
	});

	clickCard(): void {}

	deleteCard(): void {
		const planId = this.plan().id;
		if (!planId) return;

		this.store.dispatch(PlansActions.deletePlan({ planId }));
	}

	openConfirmDeleteModal(): void {
		this.isDeleteModalOpen.set(true);
	}

	closeConfirmDeleteModal(): void {
		this.isDeleteModalOpen.set(false);
	}
}
