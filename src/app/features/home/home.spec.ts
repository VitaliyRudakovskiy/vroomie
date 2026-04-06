import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import { of } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { CloudinaryService } from '@core/services/cloudinary.service';
import { Router } from '@angular/router';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const authServiceMock = {
    logout: vi.fn().mockReturnValue(Promise.resolve()),
  };

  const cloudinaryServiceMock = {
    uploadImage: vi.fn().mockReturnValue(of({ secure_url: 'http://test-url.com' })),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
