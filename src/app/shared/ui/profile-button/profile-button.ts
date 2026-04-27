import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getUserAvatar } from '@core/helpers/getUserAvatar';
import { UserService } from '@core/services/user.service';

@Component({
	selector: 'app-profile-button',
	templateUrl: './profile-button.html',
	styleUrl: './profile-button.scss',
})
export class ProfileButton {
	private readonly router = inject(Router);
	private readonly userService = inject(UserService);

	userProfile = this.userService.userProfile;

	avatar = computed(() => getUserAvatar(this.userProfile()));

	goToProfile(): void {
		this.router.navigate(['/profile']);
	}
}
