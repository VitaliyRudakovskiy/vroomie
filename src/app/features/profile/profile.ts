import {
	Component,
	type ElementRef,
	effect,
	inject,
	type OnInit,
	signal,
	viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { getUserAvatar, type UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { NotificationService } from '@core/notification/notification.service';
import { AuthService } from '@core/services/auth.service';
import { CloudinaryService } from '@core/services/cloudinary.service';
import { LoggerService } from '@core/services/logger.service';
import { UserService } from '@core/services/user.service';
import {
	ALLOWED_IMAGE_FORMATS,
	IMAGE_ACCEPT_FORMATS_STR,
	MAX_FILE_SIZE_BYTES,
	MAX_FILE_SIZE_MB,
} from '@shared/constants/avatar-config';
import { ConfirmModal } from '@shared/modals';
import { Button, Loader } from '@shared/ui';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'app-profile',
	imports: [Loader, ConfirmModal, Button],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
})
export class Profile implements OnInit {
	private readonly router = inject(Router);
	private readonly logger = inject(LoggerService);
	private readonly userService = inject(UserService);
	private readonly authService = inject(AuthService);
	private readonly notificator = inject(NotificationService);
	private readonly cloudinaryService = inject(CloudinaryService);

	fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

	currentUser = this.userService.userProfile;
	userAvatarDetails = signal<UserAvatarDetails | null>(null);
	photoLoading = signal(false);
	isConfirmModalOpen = signal(false);
	deleteLoading = signal(false);
	loading = signal(false);

	AVAILABLE_FORMATS = IMAGE_ACCEPT_FORMATS_STR;

	constructor() {
		effect(() => {
			const avatarData = getUserAvatar(this.currentUser());
			this.userAvatarDetails.set(avatarData);
		});
	}

	ngOnInit(): void {
		this.notificator.error(
			'Error',
			'This is a demo vhe following test account to explore the profile features',
		);
		this.notificator.error(
			'Error',
			'This is a demo vhe following test account to explore the profile features',
		);
		this.notificator.error(
			'Error',
			'This is a demo vhe following test account to explore the profile features',
		);

		this.notificator.error(
			'Error',
			'This is a demo vhe following test account to explore the profile features',
		);
	}

	async logout(): Promise<void> {
		try {
			await this.authService.logout();
			this.router.navigate(['auth']);
		} catch (err) {
			console.error('Logout failed', err);
		}
	}

	async onRemoveAvatar(): Promise<void> {
		this.deleteLoading.set(true);

		try {
			await this.userService.updateUserProfile({ photoUrl: null });
		} catch (error) {
			this.logger.error(`Error while deleting avatar: ${error}`);
		} finally {
			this.deleteLoading.set(false);
			this.onCloseConfirmModal();
		}
	}

	async onFileSelected(event: Event): Promise<void> {
		const filesInput = event.target as HTMLInputElement;
		if (!filesInput.files?.length) {
			return;
		}

		const newPhoto = filesInput.files[0];

		if (!ALLOWED_IMAGE_FORMATS.includes(newPhoto.type)) {
			this.notificator.error(
				'Error',
				`Unsupported format: ${newPhoto.type}. Please use PNG, JPEG, WebP or AVIF.`,
			);
			filesInput.value = '';
			return;
		}

		if (newPhoto.size > MAX_FILE_SIZE_BYTES) {
			this.notificator.error('Error', `File is too heavy! Max size is ${MAX_FILE_SIZE_MB}MB.`);
			filesInput.value = '';
			return;
		}

		this.photoLoading.set(true);

		try {
			const uploadRes = await lastValueFrom(this.cloudinaryService.uploadImage(newPhoto));
			this.logger.info(`Cloudinary success: ${uploadRes.secure_url}`);

			await this.userService.updateUserProfile({ photoUrl: uploadRes.secure_url });
			this.notificator.success('Success', 'Avatar updated!');
		} catch (err) {
			this.logger.error(`Upload/Update photo failed: ${err}`);
			this.notificator.error('Error', 'Failed to update avatar');
		} finally {
			this.photoLoading.set(false);
			filesInput.value = '';
		}
	}

	onAddAvatar(): void {
		this.fileInput()?.nativeElement.click();
	}

	onOpenConfirmModal(): void {
		this.isConfirmModalOpen.set(true);
	}

	onCloseConfirmModal(): void {
		this.isConfirmModalOpen.set(false);
	}

	goBack(): void {
		this.router.navigate(['garage']);
	}
}
