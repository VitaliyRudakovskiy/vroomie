import { Component, effect, inject, input, signal } from '@angular/core';
import { getUserAvatar, type UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { NotificationService } from '@core/notification/notification.service';
import { LoggerService } from '@core/services/logger.service';
import { UserService } from '@core/services/user.service';
import { ConfirmModal } from '@shared/modals';
import { Avatar, Card, CrossButton, Loader } from '@shared/ui';
import type { UserProfile } from 'models/user-profile';

@Component({
	selector: 'app-friends',
	templateUrl: './friends.html',
	styleUrl: './friends.scss',
	imports: [Loader, Card, Avatar, CrossButton, ConfirmModal],
})
export class Friends {
	private readonly logger = inject(LoggerService);
	private readonly userService = inject(UserService);
	private readonly notificator = inject(NotificationService);

	friends = input.required<string[]>();

	loading = signal(true);
	isDeleteModalOpen = signal(false);
	chosenFriend = signal<UserProfile | null>(null);
	profiles = signal<UserProfile[]>([]);

	constructor() {
		effect(() => {
			const ids = this.friends();

			if (ids.length === 0) {
				this.profiles.set([]);
				this.loading.set(false);
				return;
			}

			this.loadFriendsProfiles(ids);
		});
	}

	getFriendAvatar(friend: UserProfile): UserAvatarDetails {
		return getUserAvatar(friend);
	}

	async deleteFriend(): Promise<void> {
		const friend = this.chosenFriend();
		const myProfile = this.userService.userProfile();
		if (!friend || !myProfile) return;

		try {
			await this.userService.removeFriend(friend.uid, myProfile.uid);
			this.profiles.update((list) => list.filter((p) => p.uid !== friend.uid));
			this.isDeleteModalOpen.set(false);
			this.notificator.success('Removed', `${friend.displayName} was removed from your friends`);
			this.chosenFriend.set(null);
		} catch (error) {
			this.logger.error(`Ошибка при удалении друга: ${error}`);
		}
	}

	openConfirmDeleteModal(event: Event, friend: UserProfile): void {
		event.stopPropagation();
		this.chosenFriend.set(friend);
		this.isDeleteModalOpen.set(true);
	}

	closeConfirmDeleteModal(): void {
		this.isDeleteModalOpen.set(false);
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
