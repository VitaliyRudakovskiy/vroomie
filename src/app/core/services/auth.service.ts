// import { Injectable, inject, signal } from '@angular/core';
// import {
// 	Auth,
// 	authState,
// 	createUserWithEmailAndPassword,
// 	GoogleAuthProvider,
// 	signInWithEmailAndPassword,
// 	signInWithPopup,
// 	type User,
// } from '@angular/fire/auth';
// import { LoggerService } from './logger.service';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
// 	private readonly logger = inject(LoggerService);
// 	readonly auth = inject(Auth);

// 	currentUser = signal<User | null>(null);
// 	readonly isAuthReady = signal(false);

// 	constructor() {
// 		authState(this.auth).subscribe((user) => {
// 			this.currentUser.set(user);
// 			this.isAuthReady.set(true);

// 			this.logger.info(`User state: ${user ? `${user.email} logged in` : 'logged out'}`);
// 		});
// 	}

// 	async register(email: string, password: string): Promise<User> {
// 		const result = await createUserWithEmailAndPassword(this.auth, email, password);
// 		return result.user;
// 	}

// 	async login(email: string, password: string): Promise<User> {
// 		const result = await signInWithEmailAndPassword(this.auth, email, password);
// 		return result.user;
// 	}

// 	async loginWithGoogle(): Promise<User> {
// 		const googleProvider = new GoogleAuthProvider();
// 		const result = await signInWithPopup(this.auth, googleProvider);
// 		return result.user;
// 	}

// 	async logout(): Promise<void> {
// 		await this.auth.signOut();
// 	}
// }

import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { getApp } from '@angular/fire/app';
import {
	type Auth,
	authState,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
	type User,
} from '@angular/fire/auth';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly logger = inject(LoggerService);
	private readonly platformId = inject(PLATFORM_ID);

	private _auth: Auth | null = null;

	// Геттер для безопасного доступа к Auth
	private get auth(): Auth | null {
		// 1. Проверяем через официальный Angular способ
		const isBrowser = isPlatformBrowser(this.platformId);

		// 2. Добавляем прямую проверку на среду выполнения (Node vs Browser)
		const hasWindow = typeof window !== 'undefined';

		if (isBrowser || hasWindow) {
			if (!this._auth) {
				try {
					// Получаем инстанс напрямую из инициализированного приложения
					const app = getApp();
					this._auth = getAuth(app);
				} catch (e) {
					this.logger.error(`Firebase Auth initialization failed.\n${e}`);
					return null;
				}
			}
			return this._auth;
		}

		return null;
	}

	currentUser = signal<User | null>(null);
	readonly isAuthReady = signal(false);

	constructor() {
		const authInstance = this.auth;

		// Подписываемся на состояние только в браузере
		if (authInstance) {
			authState(authInstance).subscribe((user) => {
				this.currentUser.set(user);
				this.isAuthReady.set(true);
				this.logger.info(`User state: ${user ? `${user.email} logged in` : 'logged out'}`);
			});
		} else {
			// На сервере помечаем, что мы "готовы" (но юзера нет),
			// чтобы не блокировать рендеринг
			this.isAuthReady.set(true);
		}
	}

	async register(email: string, password: string): Promise<User> {
		const auth = this.auth;
		if (!auth) {
			throw new Error('Auth is not available on server');
		}

		const result = await createUserWithEmailAndPassword(auth, email, password);
		return result.user;
	}

	async login(email: string, password: string): Promise<User> {
		const auth = this.auth;
		if (!auth) {
			throw new Error('Auth is not available on server');
		}

		const result = await signInWithEmailAndPassword(auth, email, password);
		return result.user;
	}

	async loginWithGoogle(): Promise<User> {
		const auth = this.auth;
		if (!auth) {
			throw new Error('Auth is not available on server');
		}

		const googleProvider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, googleProvider);
		return result.user;
	}

	async logout(): Promise<void> {
		const auth = this.auth;
		if (auth) {
			await auth.signOut();
		}
	}
}
