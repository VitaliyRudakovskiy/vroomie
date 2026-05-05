import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Button } from '@shared/ui';
import { ProfileButton } from '@shared/ui/profile-button/profile-button';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.html',
	styleUrl: './settings.scss',
	imports: [Button, ProfileButton],
})
export class Settings {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly authService = inject(AuthService);

	async logout(): Promise<void> {
		try {
			await this.authService.logout();
			this.router.navigate(['auth']);
		} catch (err) {
			console.error('Logout failed', err);
		}
	}

	goBack(): void {
		this.router.navigate(['..'], { relativeTo: this.route });
	}
}
