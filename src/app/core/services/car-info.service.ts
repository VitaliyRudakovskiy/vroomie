import { Injectable, inject } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import type { Car } from 'models/car';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarinfoService {
	private readonly firestore = inject(Firestore);

	getCarInfo(carId: string): Observable<Car> {
		const carDocRef = doc(this.firestore, `${COLLECTIONS.Cars}/${carId}`);
		return docData(carDocRef, { idField: 'id' }) as Observable<Car>;
	}
}
