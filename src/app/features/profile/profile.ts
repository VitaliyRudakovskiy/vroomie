import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { getUserAvatar, UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { LoggerService } from '@core/services/logger.service';
import {
  ALLOWED_IMAGE_FORMATS,
  IMAGE_ACCEPT_FORMATS_STR,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/constants/avatar-config';
import { NotificationService } from '@core/notification/notification.service';
import { CloudinaryService } from '@core/services/cloudinary.service';
import { lastValueFrom } from 'rxjs';
import { ConfirmModal, Loader, Button } from '@shared/ui';
import { EditingField, ProfileForm, TextareaSize } from './types';
import { form, maxLength, minLength, required, FormField } from '@angular/forms/signals';
import { TEXTAREA_SIZE } from '@shared/constants/textarea-size';

@Component({
  selector: 'app-profile',
  imports: [Loader, ConfirmModal, Button, FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly logger = inject(LoggerService);
  private readonly userService = inject(UserService);
  private readonly notificator = inject(NotificationService);
  private readonly cloudinaryService = inject(CloudinaryService);

  userName = viewChild<ElementRef<HTMLInputElement>>('userName');
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  userStatus = viewChild<ElementRef<HTMLInputElement>>('userStatus');
  userStatusText = viewChild<ElementRef<HTMLInputElement>>('userStatusText');

  currentUser = this.userService.userProfile;
  editingField = signal<EditingField>(null);
  userAvatarDetails = signal<UserAvatarDetails | null>(null);
  photoLoading = signal(false);
  isConfirmModalOpen = signal(false);
  deleteLoading = signal(false);
  loading = signal(false);
  textareaSize = signal<TextareaSize | null>(null);
  defaultForm = signal<ProfileForm | null>(null);
  profileModel = signal<ProfileForm>({
    name: '',
    status: '',
  });

  hasNameError = computed(
    () => this.profileForm.name().touched() && this.profileForm.name().errors().length,
  );

  profileForm = form(this.profileModel, (schema) => {
    required(schema.name, { message: 'Name is required' });
    minLength(schema.name, 2, { message: 'Name is too short' });
    maxLength(schema.name, 38, { message: 'Name is too long' });
  });

  AVAILABLE_FORMATS = IMAGE_ACCEPT_FORMATS_STR;

  constructor() {
    effect(() => {
      const avatarData = getUserAvatar(this.currentUser());
      this.userAvatarDetails.set(avatarData);
    });

    effect(() => {
      const user = this.currentUser();
      if (!user) return;

      const profileData = {
        name: user.displayName,
        status: user.status ?? '',
      };

      this.defaultForm.set(profileData);
      this.profileModel.set(profileData);
    });
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
    if (!filesInput.files?.length) return;

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

  async saveUserProfile(): Promise<void> {
    if (!this.hasChanges()) return;

    this.loading.set(true);
    try {
      this.userService.updateUserProfile({
        displayName: this.profileForm.name().value(),
        status: this.profileForm.status().value(),
      });
      this.notificator.success('Success', 'Profile updated!');
    } catch (error: unknown) {
      this.logger.error(`Update profile failed: ${error}`);
      this.notificator.error('Error', 'Failed to update profile');
    } finally {
      this.loading.set(false);
    }
  }

  hasChanges(): boolean {
    const initial = this.defaultForm();
    const current = {
      name: this.profileForm.name().value(),
      status: this.profileForm.status().value(),
    };

    return initial?.name !== current.name || initial.status !== current.status;
  }

  startEditing(field: EditingField): void {
    if (field === 'status') {
      const statusSize = this.userStatusText()?.nativeElement.getBoundingClientRect();

      this.textareaSize.set({
        width: statusSize?.width ?? TEXTAREA_SIZE.width,
        height: statusSize?.height ?? TEXTAREA_SIZE.height,
      });
    }

    this.editingField.set(field);

    setTimeout(() => {
      if (field === 'name') {
        this.userName()?.nativeElement.focus();
      }

      if (field === 'status') {
        const textarea = this.userStatus()?.nativeElement;
        if (!textarea) return;

        textarea.focus();
      }
    });
  }

  stopEditing(field: EditingField): void {
    this.editingField.set(null);
    if (!field) return;

    const newValue = this.profileModel()[field];
    this.profileModel.update((model) => ({
      ...model,
      [field]: newValue,
    }));
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
}
