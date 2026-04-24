import { Injectable, inject } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { COLLECTIONS } from '@core/api/dbCollections';
import { plansByCarId } from '@core/api/queries/plans';
import type { Plan, PlanWithoutId } from 'models/plan';
import { from, map, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlansService {
	private readonly firestore = inject(Firestore);

	getPlansByCarId(carId: string): Observable<Plan[]> {
		const plans = collection(this.firestore, COLLECTIONS.Plans);
		const plansQuery = plansByCarId(plans, carId);
		return collectionData(plansQuery, { idField: 'id' }) as Observable<Plan[]>;
	}

	addPlan(plan: PlanWithoutId): Observable<Plan> {
		const plans = collection(this.firestore, COLLECTIONS.Plans);
		return from(addDoc(plans, plan)).pipe(map((doc) => ({ ...plan, id: doc.id })));
	}
}
