export interface ProfileForm {
	name: string;
}

export type EditingField = keyof ProfileForm | null;

export interface TextareaSize {
	width: number;
	height: number;
}
