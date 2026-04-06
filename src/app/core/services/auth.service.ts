import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly logger = inject(LoggerService);
  readonly auth = inject(Auth);

  currentUser = signal<User | null>(null);
  readonly isAuthReady = signal(false);

  constructor() {
    authState(this.auth).subscribe((user) => {
      this.currentUser.set(user);
      this.isAuthReady.set(true);

      this.logger.info(`User state: ${user ? `${user.email} logged in` : 'logged out'}`);
    });
  }

  async register(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async login(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async loginWithGoogle(): Promise<User> {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, googleProvider);
    return result.user;
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
  }
}
