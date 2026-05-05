import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '@core/services/local-storage.service';

export const authGuard: CanActivateFn = () => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const localStorageService = inject(LocalStorageService);

	// Ждём, пока Firebase скажет, кто пользователь
	return toObservable(authService.isAuthReady).pipe(
		filter(Boolean),
		take(1),
		map(() => {
			if (authService.currentUser()) return true;

			const attemptedUrl = router.url;
			localStorageService.save('pending-invite', attemptedUrl);

			router.navigate(['/auth']);
			return false;
		}),
	);
};
