import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getUserAvatar, type UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { NotificationService } from '@core/notification/notification.service';
import { AuthService } from '@core/services/auth.service';
import { CloudinaryService } from '@core/services/cloudinary.service';
import { LoggerService } from '@core/services/logger.service';
import { UserService } from '@core/services/user.service';
import {
	ALLOWED_IMAGE_FORMATS,
	MAX_FILE_SIZE_BYTES,
	MAX_FILE_SIZE_MB,
} from '@shared/constants/avatar-config';
import { ChangeNameModal, ConfirmModal } from '@shared/modals';
import { Button } from '@shared/ui';
import { lastValueFrom } from 'rxjs';
import { Avatar } from './components/avatar/avatar';

@Component({
	selector: 'app-profile',
	imports: [ConfirmModal, Button, Avatar, ChangeNameModal],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
})
export class Profile {
	private readonly router = inject(Router);
	private readonly logger = inject(LoggerService);
	private readonly userService = inject(UserService);
	private readonly authService = inject(AuthService);
	private readonly notificator = inject(NotificationService);
	private readonly cloudinaryService = inject(CloudinaryService);

	avatarComponent = viewChild<Avatar>('avatarComponent');

	currentUser = this.userService.userProfile;
	userAvatarDetails = signal<UserAvatarDetails | null>(null);
	isConfirmModalOpen = signal(false);
	isChangeNameModalOpen = signal(false);
	deleteLoading = signal(false);
	photoLoading = signal(false);

	constructor() {
		effect(() => {
			const avatarData = getUserAvatar(this.currentUser());
			this.userAvatarDetails.set(avatarData);
		});
	}

	async logout(): Promise<void> {
		try {
			await this.authService.logout();
			this.router.navigate(['auth']);
		} catch (err) {
			console.error('Logout failed', err);
		}
	}

	onChangePhoto(): void {
		if (this.currentUser()?.photoUrl) {
			this.openConfirmChangeModal();
			return;
		} else {
			this.avatarComponent()?.triggerFileInput();
		}
	}

	onFileSelectedFromChild(file: File): void {
		this.onFileSelected(file);
	}

	async removeAvatar(): Promise<void> {
		this.deleteLoading.set(true);

		try {
			await this.userService.updateUserProfile({ photoUrl: null });
			this.avatarComponent()?.triggerFileInput();
		} catch (error) {
			this.logger.error(`Error while deleting avatar: ${error}`);
		} finally {
			this.deleteLoading.set(false);
			this.onCloseConfirmModal();
		}
	}

	async onFileSelected(file: File): Promise<void> {
		if (!file) return;

		if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
			this.notificator.error(
				'Error',
				`Unsupported format: ${file.type}. Please use PNG, JPEG, WebP or AVIF.`,
			);
			return;
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			this.notificator.error('Error', `File is too heavy! Max size is ${MAX_FILE_SIZE_MB}MB.`);
			return;
		}

		this.photoLoading.set(true);

		try {
			const uploadRes = await lastValueFrom(this.cloudinaryService.uploadImage(file));
			await this.userService.updateUserProfile({ photoUrl: uploadRes.secure_url });
			this.notificator.success('Success', 'Avatar updated!');
		} catch (err) {
			this.logger.error(`Upload/Update photo failed: ${err}`);
			this.notificator.error('Error', 'Failed to update avatar');
		} finally {
			this.photoLoading.set(false);
		}
	}

	openChangeNameModal(): void {
		this.isChangeNameModalOpen.set(true);
	}

	closeChangeNameModal(): void {
		this.isChangeNameModalOpen.set(false);
	}

	onCloseConfirmModal(): void {
		this.isConfirmModalOpen.set(false);
	}

	goBack(): void {
		this.router.navigate(['garage']);
	}

	private openConfirmChangeModal(): void {
		this.isConfirmModalOpen.set(true);
	}
}
