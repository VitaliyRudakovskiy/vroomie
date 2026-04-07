import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Button } from '@shared/ui';

@Component({
	selector: 'app-home',
	imports: [Button],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	private readonly router = inject(Router);
	private readonly authService = inject(AuthService);

	async logout(): Promise<void> {
		try {
			await this.authService.logout();
			this.router.navigate(['auth']);
		} catch (err) {
			console.error('Logout failed', err);
		}
	}
}
