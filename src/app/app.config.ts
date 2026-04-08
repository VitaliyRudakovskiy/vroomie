import {
	type ApplicationConfig,
	isDevMode,
	provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { garageReducer } from 'store/garage/reducers';
import { GarageEffects } from 'store/garage/effects';

import { environment } from '../environment/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),

		// NgRx
		provideStore({
			garage: garageReducer,
		}),
		provideEffects([GarageEffects]),
		provideStoreDevtools({
			maxAge: 25,
			logOnly: !isDevMode(),
			autoPause: true,
			trace: false,
			traceLimit: 75,
		}),

		// Firebase providers
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		provideDatabase(() => getDatabase()),
	],
};
