import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth } from './auth';
import { NotificationService } from '@core/notification/notification.service';
import { LoggerService } from '@core/services/logger.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;

  const authServiceMock = {
    login: vi.fn(),
    register: vi.fn(),
    loginWithGoogle: vi.fn(),
  };

  const notificationServiceMock = {
    error: vi.fn(),
    success: vi.fn(),
  };

  const loggerServiceMock = {
    error: vi.fn(),
    log: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial login state as true', () => {
    expect(component.isLoginForm()).toBe(true);
  });

  it('should toggle form mode', () => {
    component.toggleForm();
    expect(component.isLoginForm()).toBe(false);
  });
});
