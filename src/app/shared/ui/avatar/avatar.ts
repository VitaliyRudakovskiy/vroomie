import { Component, type ElementRef, input, output, viewChild } from '@angular/core';
import type { UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { IMAGE_ACCEPT_FORMATS_STR } from '@shared/constants/avatar-config';
import { Loader } from '@shared/ui';

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.html',
	styleUrl: './avatar.scss',
	imports: [Loader],
	host: {
		'[style.--initials-size]': 'fontSize()',
		'[style.--border-radius]': 'borderRadius()',
		'[style.--box-shadow]': 'boxShadow()',
	},
})
export class Avatar {
	fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

	userAvatar = input.required<UserAvatarDetails | null>();
	loading = input(false);
	size = input(210);
	fontSize = input('56px');
	borderRadius = input('28px');
	boxShadow = input('7px');

	fileSelected = output<File>();

	protected readonly availableFormats = IMAGE_ACCEPT_FORMATS_STR;

	onFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) this.fileSelected.emit(input.files[0]);
		input.value = '';
	}

	triggerFileInput(): void {
		this.fileInput()?.nativeElement.click();
	}
}
