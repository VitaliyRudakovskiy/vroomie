import { Component, effect, inject, signal } from '@angular/core';
import { SIDEBAR_ITEMS } from './constants';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { getUserAvatar, UserAvatarDetails } from '@core/helpers/getUserAvatar';

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
