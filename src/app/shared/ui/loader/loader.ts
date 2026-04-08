import { Component, input } from '@angular/core';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.html',
	styleUrl: './loader.scss',
	host: {
		'[style.background-color]': "withBlur() ?'rgba(255, 255, 255, 0.3)' : ''",
		'[style.backdrop-filter]': "withBlur() ? 'blur(4px)' : ''",
	},
})
export class Loader {
	withBlur = input(true);
  spinnerSize = input(40);
  spinnerThikness = input(5);
	description = input('');
}
