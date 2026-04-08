export const BODY_TYPES = {
	SEDAN: 'Sedan',
	HATCHBACK: 'Hatchback',
	SUV: 'SUV',
	CROSSOVER: 'Crossover',
	COUPE: 'Coupe',
	WAGON: 'Wagon',
	VAN: 'Van',
	MINIVAN: 'Minivan',
	PICKUP: 'Pickup Truck',
	ROADSTER: 'Roadster',
	TARGA: 'Targa',
	LIFTBACK: 'Liftback',
	FASTBACK: 'Fastback',
	LIMOUSINE: 'Limousine',
} as const;

export type BodyType = (typeof BODY_TYPES)[keyof typeof BODY_TYPES];

export const BODY_TYPES_LIST = Object.values(BODY_TYPES);
