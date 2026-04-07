import { effect, Injectable, inject, signal } from '@angular/core';
import {
	type DocumentReference,
	doc,
	Firestore,
	getDoc,
	serverTimestamp,
	setDoc,
	type Timestamp,
} from '@angular/fire/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from 'models/user-profile';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
	private readonly firestore = inject(Firestore);
	private readonly authService = inject(AuthService);
	private readonly logger = inject(LoggerService);

	userProfile = signal<UserProfile | null>(null);
	private readonly USERS_COLLECTION = 'users';

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
		const userId = this.userProfile()?.uid;
		if (!userId) {
			this.logger.error('No user is currently logged in.');
			return;
		}

		try {
			const userRef = this.getUserDocRef(userId);

			const dataToUpdate = {
				...updatedData,
				updatedAt: serverTimestamp() as Timestamp,
			};

			await setDoc(userRef, dataToUpdate, { merge: true });
			const currentProfile = this.userProfile();

			if (currentProfile) {
				this.userProfile.set({ ...currentProfile, ...dataToUpdate });
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
		return doc(this.firestore, this.USERS_COLLECTION, uid);
	}

	private createUser(user: User): UserProfile {
		return {
			uid: user.uid,
			email: user.email ?? '',
			displayName: user.displayName ?? 'New user',
			photoUrl: user.photoURL ?? null,
			status: '',
			createdAt: serverTimestamp() as Timestamp,
			updatedAt: serverTimestamp() as Timestamp,
		};
	}
}
