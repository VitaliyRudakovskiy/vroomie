import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { signal } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/notification/notification.service';
import { CloudinaryService } from '@core/services/cloudinary.service';
import { vi } from 'vitest';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  const userServiceMock = {
    userProfile: signal({
      uid: '123',
      displayName: 'Test User',
      photoUrl: null,
      email: 'test@test.com',
    }),
    updateUserProfile: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: LoggerService, useValue: { info: vi.fn(), error: vi.fn() } },
        { provide: NotificationService, useValue: { error: vi.fn(), success: vi.fn() } },
        { provide: CloudinaryService, useValue: { uploadImage: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
