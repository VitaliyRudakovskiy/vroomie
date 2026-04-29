import { Component, effect, inject, input, signal } from '@angular/core';
import { getUserAvatar, type UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { LoggerService } from '@core/services/logger.service';
import { UserService } from '@core/services/user.service';
import { Avatar, Card, Loader } from '@shared/ui';
import type { UserProfile } from 'models/user-profile';

@Component({
	selector: 'app-friends',
	templateUrl: './friends.html',
	styleUrl: './friends.scss',
	imports: [Loader, Card, Avatar],
})
export class Friends {
	private readonly logger = inject(LoggerService);
	private readonly userService = inject(UserService);

	friends = input.required<string[]>();

	loading = signal(true);
	profiles = signal<UserProfile[]>([]);

	constructor() {
		effect(() => {
			const ids = this.friends();
			if (ids.length > 0) this.loadFriendsProfiles(ids);
		});
	}

	getFriendAvatar(friend: UserProfile): UserAvatarDetails {
		return getUserAvatar(friend);
	}

	private async loadFriendsProfiles(ids: string[]): Promise<void> {
		this.loading.set(true);

		try {
			const profiles = await Promise.all(ids.map((id) => this.userService.getProfileById(id)));
			this.profiles.set(profiles.filter((p): p is UserProfile => p !== null));
		} catch {
			this.logger.error('Произошла ошибка при загрузке профилей пользователей');
		} finally {
			this.loading.set(false);
		}
	}
}
