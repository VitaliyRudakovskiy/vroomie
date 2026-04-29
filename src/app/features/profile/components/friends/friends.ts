import { Component, input } from '@angular/core';

@Component({
	selector: 'app-friends',
	templateUrl: './friends.html',
	styleUrl: './friends.scss',
})
export class Friends {
	friends = input.required<string[]>();
}
