import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environment/environment';

// разновидности логов
export enum LogEnum {
  DEBUG = 0,
  INFO = 1,
  ERROR = 2,
}

export interface LogEntry {
  message: unknown;
  timestamp: Date;
  type: LogEnum;
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private logs = signal<LogEntry[]>([]);

  debug(message: unknown): void {
    if (environment.production) return;

    console.log('[DEBUGGING]', message);
    this.logs.update((old) => [...old, { message, timestamp: new Date(), type: LogEnum.DEBUG }]);
  }

  info(message: unknown): void {
    if (environment.production) return;

    console.warn('[INFO]', message);
    this.logs.update((old) => [...old, { message, timestamp: new Date(), type: LogEnum.INFO }]);
  }

  error(message: unknown): void {
    if (environment.production) return;

    console.error('[ERROR]', message);
    this.logs.update((old) => [...old, { message, timestamp: new Date(), type: LogEnum.ERROR }]);
  }

  getLogsHistory(): LogEntry[] {
    return environment.production ? [] : [...this.logs()];
  }

  clearHistory(): void {
    if (environment.production) return;
    this.logs.set([]);
  }
}
