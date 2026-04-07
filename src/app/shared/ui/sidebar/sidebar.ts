import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { getUserAvatar, type UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { UserService } from '@core/services/user.service';
import { SIDEBAR_ITEMS } from './constants';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
	imports: [RouterLink, RouterModule],
})
export class Sidebar {
	private readonly userService = inject(UserService);

	userAvatarDetails = signal<UserAvatarDetails | null>(null);
	currentUserInfo = this.userService.userProfile;

	constructor() {
		effect(() => {
			const avatarData = getUserAvatar(this.currentUserInfo());
			this.userAvatarDetails.set(avatarData);
		});
	}

	sidebarItems = SIDEBAR_ITEMS;
}
