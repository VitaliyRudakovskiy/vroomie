import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@core/notification/notification.service';
import { AuthService } from '@core/services/auth.service';
import { LoggerService } from '@core/services/logger.service';
import { Button, Card } from '@shared/ui';
import { getErrorMessage } from './helpers/getAuthErrorMessage';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-auth',
	imports: [ReactiveFormsModule, Button, Card],
	templateUrl: './auth.html',
	styleUrl: './auth.scss',
})
export class Auth {
	private readonly router = inject(Router);
	private readonly logger = inject(LoggerService);
	private readonly authService = inject(AuthService);
	private readonly notificator = inject(NotificationService);

	loading = signal(false);
	isLoginForm = signal(true);
	isPasswordVisible = signal(false);
	errorMessage = signal('Something went wrong. Please try again.');

	loginForm = new FormGroup({
		email: new FormControl('', {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		password: new FormControl('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
		}),
	});

	get hasPasswordError(): boolean {
		const control = this.loginForm.controls.password;
		return control.touched && control.invalid;
	}

	get hasEmailError(): boolean {
		const control = this.loginForm.controls.email;
		return control.touched && control.invalid;
	}

	constructor() {
		// Сброс полей и ошибок при переключении между Login и Register
		effect(() => {
			this.isLoginForm();
			this.loginForm.reset();
		});
	}

	async signInApp(): Promise<void> {
		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}

		const callMethod = this.isLoginForm()
			? this.authService.login.bind(this.authService)
			: this.authService.register.bind(this.authService);

		const { email, password } = this.loginForm.getRawValue();

		try {
			this.loading.set(true);
			await callMethod(email, password);
			this.router.navigate(['']);
		} catch (err: unknown) {
			this.logger.error(`Auth error: ${err}`);
			this.loginForm.patchValue({ password: '' });
			this.showAuthError(err);
		} finally {
			this.loading.set(false);
		}
	}

	async loginWithGoogle(): Promise<void> {
		try {
			await this.authService.loginWithGoogle();
			this.router.navigate(['']);
		} catch (err: unknown) {
			this.logger.error(`Auth error with Google: ${err}`);
			this.loginForm.patchValue({ password: '' });
			this.showAuthError(err);
		}
	}

	toggleForm(): void {
		this.isLoginForm.update((f) => !f);
	}

	togglePassword(): void {
		this.isPasswordVisible.update((v) => !v);
	}

	private showAuthError(err: unknown): void {
		if (err && typeof err === 'object' && 'code' in err) {
			const code = (err as { code: string }).code;
			this.errorMessage.set(getErrorMessage(code));
		}

		this.notificator.error('Error', this.errorMessage());
	}
}
