import { Component, signal } from '@angular/core';
import { Button } from '@shared/ui';

@Component({
	selector: 'app-garage',
	templateUrl: './garage.html',
	styleUrl: './garage.scss',
	imports: [Button],
})
export class Garage {
	isAddCarModalOpen = signal(false);

	showAddCarModal(): void {
		this.isAddCarModalOpen.set(true);
	}

	closeAddCarModal(): void {
		this.isAddCarModalOpen.set(false);
	}
}
