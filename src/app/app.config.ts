import {
	type ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { environment } from '../environment/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideZonelessChangeDetection(),

		// Firebase providers
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		provideDatabase(() => getDatabase()),
	],
};
