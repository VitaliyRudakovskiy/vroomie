import { Component } from '@angular/core';
import { NAVBAR_ITEMS } from './constants';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.html',
	styleUrl: './navbar.scss',
	imports: [RouterLink, RouterModule],
})
export class Navbar {
	protected readonly navbarElements = NAVBAR_ITEMS;
}
