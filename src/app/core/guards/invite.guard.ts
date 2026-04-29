import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { UserService } from '../services/user.service';

export const inviteGuard: CanActivateFn = (route) => {
	const userService = inject(UserService);
	const router = inject(Router);
	const friendId = route.params['initiatorId'];

	return toObservable(userService.userProfile).pipe(
		filter((profile) => !!profile),
		take(1),
		map((profile) => {
			if (profile?.uid === friendId || profile.friends?.includes(friendId))
				return router.parseUrl('/profile');
			return true;
		}),
	);
};
