import { Component, computed, effect, inject, signal } from '@angular/core';
import {
	debounce,
	email,
	FormField,
	form,
	maxLength,
	minLength,
	required,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { NotificationService } from '@core/notification/notification.service';
import { AuthService } from '@core/services/auth.service';
import { LoggerService } from '@core/services/logger.service';
import { Button, Card } from '@shared/ui';
import { getErrorMessage } from './helpers/getAuthErrorMessage';
import type { LoginData } from './types';

@Component({
	selector: 'app-auth',
	imports: [FormField, Button, Card, FormField],
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
	loginModel = signal<LoginData>({
		email: '',
		password: '',
	});

	loginForm = form(this.loginModel, (schema) => {
		debounce(schema.email, 200);
		required(schema.email, { message: 'Email is required' });
		email(schema.email, { message: 'Enter a valid email address' });
		required(schema.password, { message: 'Password is required' });
		minLength(schema.password, 6, { message: 'Password must have at least 6 symbols' });
		maxLength(schema.password, 50, { message: 'Password is too long' });
	});

	hasPasswordError = computed(
		() => this.loginForm.password().touched() && this.loginForm.password().errors().length,
	);
	hasEmailError = computed(
		() => this.loginForm.email().touched() && this.loginForm.email().errors().length,
	);

	constructor() {
		// сброс полей и ошибок при смене формы с регистрации на вход и обратно
		effect(() => {
			this.isLoginForm();
			this.loginForm().reset();
			this.loginModel.set({
				email: '',
				password: '',
			});
		});
	}

	async signInApp(): Promise<void> {
		if (!this.loginForm().valid()) {
			return;
		}

		const callMethod = this.isLoginForm()
			? this.authService.login.bind(this.authService)
			: this.authService.register.bind(this.authService);

		try {
			this.loading.set(true);
			await callMethod(this.loginModel().email, this.loginModel().password);
			this.router.navigate(['']);
		} catch (err: unknown) {
			this.logger.error(`Auth error: ${err}`);
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
