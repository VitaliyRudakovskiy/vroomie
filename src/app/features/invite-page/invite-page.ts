import { Component, effect, inject, input, type OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { getUserAvatar, type UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { NotificationService } from '@core/notification/notification.service';
import { UserService } from '@core/services/user.service';
import { Avatar, Button, Loader } from '@shared/ui';
import type { UserProfile } from 'models/user-profile';

@Component({
	selector: 'app-invite-page',
	templateUrl: './invite-page.html',
	styleUrl: './invite-page.scss',
	imports: [Loader, Avatar, Button],
})
export class InvitePage implements OnInit {
	private readonly router = inject(Router);
	private readonly userService = inject(UserService);
	private readonly notificator = inject(NotificationService);

	initiatorId = input.required<string>();

	initiatorProfile = signal<UserProfile | null>(null);
	userAvatarDetails = signal<UserAvatarDetails | null>(null);
	isLoadingUser = signal(false);
	currentUser = this.userService.userProfile;

	constructor() {
		effect(() => {
			const avatarData = getUserAvatar(this.currentUser());
			this.userAvatarDetails.set(avatarData);
		});
	}

	ngOnInit(): void {
		this.loadFriendInfo();
	}

	async onApprove(): Promise<void> {
		const id = this.initiatorId();
		const myId = this.currentUser()?.uid;
		if (!myId) return;

		try {
			await this.userService.becomeFriends(id, myId);
			this.router.navigate(['garage']);
			this.notificator.success(
				'New Friend',
				`You become friends with ${this.initiatorProfile()?.displayName}`,
			);
		} catch (error) {
			console.error('Ошибка при добавлении в друзья', error);
		}
	}

	onReject(): void {
		this.router.navigate(['garage']);
	}

	private async loadFriendInfo() {
		const id = this.initiatorId();
		if (!id) return;

		this.isLoadingUser.set(true);
		try {
			const profile = await this.userService.getProfileById(id);
			if (profile) this.initiatorProfile.set(profile);
		} catch {
			this.initiatorProfile.set(null);
		} finally {
			this.isLoadingUser.set(false);
		}
	}
}
