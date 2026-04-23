import { provideHttpClient } from '@angular/common/http';
import {
	type ApplicationConfig,
	isDevMode,
	LOCALE_ID,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { CarInfoEffects } from 'store/car-info/effects';
import { carInfoReducer } from 'store/car-info/reducers';
import { GarageEffects } from 'store/garage/effects';
import { garageReducer } from 'store/garage/reducers';
import { PlansEffects } from 'store/plans/effects';
import { plansReducer } from 'store/plans/reducers';
import { ServicesEffects } from 'store/services/effects';
import { servicesReducer } from 'store/services/reducers';
import { environment } from '../environment/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(),
		provideZonelessChangeDetection(),
		{ provide: LOCALE_ID, useValue: 'ru-RU' },

		// NgRx
		provideStore({
			garage: garageReducer,
			carInfo: carInfoReducer,
			services: servicesReducer,
			plans: plansReducer,
		}),
		provideEffects([GarageEffects, CarInfoEffects, ServicesEffects, PlansEffects]),
		provideStoreDevtools({
			maxAge: 25,
			logOnly: !isDevMode(),
			autoPause: true,
			trace: false,
			traceLimit: 75,
		}),

		// Firebase
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
	],
};
