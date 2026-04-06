import { Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification {
  private readonly notificationService = inject(NotificationService);

  notify = this.notificationService.notification;

  protected close(): void {
    this.notificationService.hide();
  }
}
