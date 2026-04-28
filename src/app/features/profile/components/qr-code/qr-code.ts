import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { QrCodeModal } from '@shared/modals/qr-code-modal/qr-code-modal';
import { environment } from '../../../../../environment/environment';

@Component({
	selector: 'app-qr-code',
	templateUrl: './qr-code.html',
	styleUrl: './qr-code.scss',
	imports: [QrCodeModal],
})
export class QrCode {
	private readonly userService = inject(UserService);

	isQrModalVisible = signal(false);
	currentUser = this.userService.userProfile;

	inviteLink = computed(() => `${environment.appLink}/invite/${this.currentUser()?.uid}`);

	openQrModal(): void {
		this.isQrModalVisible.set(true);
	}

	closeQrModal(): void {
		this.isQrModalVisible.set(false);
	}
}
