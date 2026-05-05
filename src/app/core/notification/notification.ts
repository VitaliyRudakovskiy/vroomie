import { Component, inject } from '@angular/core';
import { CrossButton } from '@shared/ui';
import { NotificationService } from './notification.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.html',
	styleUrl: './notification.scss',
	imports: [CrossButton],
})
export class Notification {
	private readonly notificationService = inject(NotificationService);

	notify = this.notificationService.notification;

	protected close(_event: Event): void {
		this.notificationService.hide();
	}
}
