import { Injectable, inject } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { plansByCarId } from '@core/api/queries/plans';
import type { Plan } from 'models/plan';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlansService {
	private readonly firestore = inject(Firestore);

	getPlansByCarId(carId: string): Observable<Plan[]> {
		const plans = collection(this.firestore, COLLECTIONS.Plans);
		const plansQuery = plansByCarId(plans, carId);
		return collectionData(plansQuery, { idField: 'id' }) as Observable<Plan[]>;
	}
}
