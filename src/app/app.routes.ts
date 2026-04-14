import type { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Auth } from './features/auth/auth';
import { MainLayout } from './layout/main-layout';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'garage',
		pathMatch: 'full',
	},
	{
		path: '',
		component: MainLayout,
		canActivate: [authGuard],
		children: [
			{
				path: 'garage',
				loadComponent: () => import('./features/garage/garage').then((m) => m.Garage),
			},
			{
				path: 'garage/:carId',
				loadComponent: () => import('./features/car-info/car-info').then((m) => m.CarInfo),
			},
			{
				path: 'profile',
				loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
			},
		],
	},
	{
		path: 'auth',
		component: Auth,
	},
	{
		path: '**',
		redirectTo: 'garage',
	},
];
