import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ConfirmModal } from '@shared/modals';
import { Button, ProfileButton } from '@shared/ui';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.html',
	styleUrl: './settings.scss',
	imports: [Button, ProfileButton, ConfirmModal],
})
export class Settings {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly authService = inject(AuthService);
	private readonly userService = inject(UserService);

	currentUser = this.userService.userProfile;
	isDeleteAccountModalOpen = signal(false);
	deleteLoading = signal(false);

	async logout(): Promise<void> {
		try {
			await this.authService.logout();
			this.router.navigate(['auth']);
		} catch (err) {
			console.error('Logout failed', err);
		}
	}

	openDeleteAccountModal(): void {
		this.isDeleteAccountModalOpen.set(true);
	}

	closeDeleteAccountModal(): void {
		this.isDeleteAccountModalOpen.set(false);
	}

	deleteAccount(): void {}

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}
}
