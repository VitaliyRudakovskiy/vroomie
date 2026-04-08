import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NAVBAR_ITEMS } from './constants';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.html',
	styleUrl: './navbar.scss',
	imports: [RouterLink, RouterModule],
})
export class Navbar {
	protected readonly navbarElements = NAVBAR_ITEMS;
}
