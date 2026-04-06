import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  summary: string;
  message: string;
  type: NotificationType;
  fadingOut?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notification = signal<Notification | null>(null);
  private lastTimeoutId?: number;

  private show(summary: string, message: string, type: NotificationType, duration = 3000): void {
    if (this.notification()) this.startFadeOut(() => this.setNew(summary, message, type, duration));
    else this.setNew(summary, message, type, duration);
  }

  hide(): void {
    if (this.notification()) this.startFadeOut();
    clearTimeout(this.lastTimeoutId);
  }

  success(summary: string, message: string, duration?: number): void {
    this.show(summary, message, 'success', duration);
  }

  error(summary: string, message: string, duration?: number): void {
    this.show(summary, message, 'error', duration);
  }

  warning(summary: string, message: string, duration?: number): void {
    this.show(summary, message, 'warning', duration);
  }

  info(summary: string, message: string, duration?: number): void {
    this.show(summary, message, 'info', duration);
  }

  private setNew(summary: string, message: string, type: NotificationType, duration: number): void {
    this.notification.set({ summary, message, type });
    clearTimeout(this.lastTimeoutId);
    this.lastTimeoutId = setTimeout(() => this.hide(), duration);
  }

  private startFadeOut(callback?: () => void): void {
    const current = this.notification();
    if (!current) return;

    this.notification.set({ ...current, fadingOut: true });

    setTimeout(() => {
      this.notification.set(null);
      if (callback) callback();
    }, 100);
  }
}
