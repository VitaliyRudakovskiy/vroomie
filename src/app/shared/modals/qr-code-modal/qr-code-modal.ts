import { Component, inject, input, output } from '@angular/core';
import { NotificationService } from '@core/notification/notification.service';
import { Button, ModalWrapper } from '@shared/ui';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
	selector: 'app-qr-code-modal',
	templateUrl: './qr-code-modal.html',
	styleUrl: './qr-code-modal.scss',
	imports: [ModalWrapper, QRCodeComponent, Button],
})
export class QrCodeModal {
	private readonly notificator = inject(NotificationService);

	visible = input.required<boolean>();
	qrLink = input.required<string>();

	closeModal = output();

	copyInviteLink(): void {
		try {
			navigator.clipboard.writeText(this.qrLink());
			this.notificator.info('Copied', 'Invitation link copied to clipboard');
		} catch {
			this.notificator.info('Error', 'Invitation link was not copied');
		} finally {
			this.onClose();
		}
	}

	downloadQr(): void {
		const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
		if (!canvas) return;

		try {
			canvas.toBlob((blob) => {
				if (!blob) return;
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'invite-qr.png';
				link.click();
				URL.revokeObjectURL(url);
			});
			this.notificator.info('Saved', 'QR code was saved');
		} catch {
			this.notificator.info('Error', 'QR code was not saved');
		} finally {
			this.onClose();
		}
	}

	onClose(): void {
		this.closeModal.emit();
	}
}
