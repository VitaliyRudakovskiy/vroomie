import { Component, inject, input, signal } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { Button } from '@shared/ui';
import { CarModal } from '@shared/ui/car-modal/car-modal';
import type { Car } from 'models/car';

@Component({
	selector: 'app-general-info',
	templateUrl: './general-info.html',
	styleUrl: './general-info.scss',
	imports: [Button, CarModal],
})
export class GeneralInfo {
	private readonly userService = inject(UserService);

	carInfo = input.required<Car>();

	isEditModalOpen = signal(false);
	userProfile = this.userService.userProfile;

	openEditModal(): void {
		this.isEditModalOpen.set(true);
	}

	closeEditModal(): void {
		this.isEditModalOpen.set(false);
	}
}
