import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Ждём, пока Firebase скажет, кто пользователь
  return toObservable(authService.isAuthReady).pipe(
    filter(Boolean),
    take(1),
    map(() => {
      if (authService.currentUser()) return true;

      router.navigate(['/auth']);
      return false;
    }),
  );
};
