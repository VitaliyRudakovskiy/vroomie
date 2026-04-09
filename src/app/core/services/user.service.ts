import { isPlatformBrowser } from '@angular/common';
import { effect, Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { getApp } from '@angular/fire/app';
import {
	type DocumentReference,
	doc,
	type Firestore,
	getDoc,
	getFirestore,
	setDoc,
} from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import type { User } from 'firebase/auth';
import type { UserProfile } from 'models/user-profile';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
	// private readonly firestore = inject(Firestore);
	private readonly authService = inject(AuthService);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly logger = inject(LoggerService);

	private _db: Firestore | null = null;

	// Геттер для безопасного получения инстанса
	private get db(): Firestore | null {
		if (isPlatformBrowser(this.platformId)) {
			if (!this._db) {
				try {
					this._db = getFirestore(getApp());
				} catch (_e) {
					return null;
				}
			}
			return this._db;
		}
		return null;
	}

	userProfile = signal<UserProfile | null>(null);

	constructor() {
		effect(() => {
			const user = this.authService.currentUser();
			if (!user) {
				return;
			}

			if (!this.authService.currentUser()) {
				this.userProfile.set(null);
				return;
			}

			this.initializeUserProfile(user);
		});
	}

	async createUserProfile(user: User): Promise<void> {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		const userRef = this.getUserDocRef(user.uid);
		const userSnapshot = await getDoc(userRef);

		if (userSnapshot.exists()) {
			this.logger.info(`User profile already exists for UID: ${user.uid}`);
			return;
		}

		const newUserProfile = this.createUser(user);
		this.logger.info(`User profile created: ${user.uid}`);
		await setDoc(userRef, newUserProfile);
	}

	async updateUserProfile(updatedData: Partial<UserProfile>): Promise<void> {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		const userId = this.userProfile()?.uid;
		if (!userId) {
			this.logger.error('No user is currently logged in.');
			return;
		}

		try {
			const userRef = this.getUserDocRef(userId);

			await setDoc(userRef, updatedData, { merge: true });
			const currentProfile = this.userProfile();

			if (currentProfile) {
				this.userProfile.set({ ...currentProfile, ...updatedData });
			}
			this.logger.info(`User profile updated for UID: ${userId}`);
		} catch (error) {
			this.logger.error(`Failed to update profile: ${error}`);
			throw error;
		}
	}

	private async initializeUserProfile(user: User): Promise<void> {
		try {
			const userRef = this.getUserDocRef(user.uid);
			const userSnapshot = await getDoc(userRef);

			if (userSnapshot.exists()) {
				this.userProfile.set(userSnapshot.data() as UserProfile);
				this.logger.info(`Profile loaded for: ${user.uid}`);
			} else {
				const newUserProfile = this.createUser(user);
				await setDoc(userRef, newUserProfile);
				this.userProfile.set(newUserProfile);
				this.logger.info(`New profile created for: ${user.uid}`);
			}
		} catch (error) {
			this.logger.error(`Error initializing profile: ${error}`);
		}
	}

	private getUserDocRef(uid: string): DocumentReference {
		const db = this.db;
		if (!db) {
			throw new Error('Firestore is not available (Server Side)');
		}
		return doc(db, COLLECTIONS.Users, uid);
	}

	private createUser(user: User): UserProfile {
		return {
			uid: user.uid,
			email: user.email ?? '',
			displayName: user.displayName ?? 'New user',
			photoUrl: user.photoURL ?? null,
			createdAt: Date.now(),
			friends: [],
		};
	}
}
