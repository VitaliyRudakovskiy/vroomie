import type { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Auth } from './features/auth/auth';
import { MainLayout } from './layout/main-layout';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: '',
		component: MainLayout,
		canActivate: [authGuard],
		children: [
			{
				path: 'home',
				loadComponent: () => import('./features/home/home').then((m) => m.Home),
			},
			{
				path: 'pair',
				loadComponent: () => import('./features/pair/pair').then((m) => m.Pair),
			},
			{
				path: 'friends',
				loadComponent: () => import('./features/friends/friends').then((m) => m.Friends),
			},
			{
				path: 'chat',
				loadComponent: () => import('./features/chat/chat').then((m) => m.Chat),
			},
			{
				path: 'profile',
				loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
			},
			{
				path: 'settings',
				loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
			},
		],
	},
	{
		path: 'auth',
		component: Auth,
	},
	{
		path: '**',
		redirectTo: 'home',
	},
];
