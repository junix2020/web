import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CityAssociatedAreasBarangayState, CityAssociatedAreasBarangayStore } from './city-associated-area-barangay-picklist.store';

@Injectable({
   providedIn: 'root'
})
export class CityAssociatedAreasBarangayQuery extends QueryEntity<CityAssociatedAreasBarangayState> {
   constructor(protected store: CityAssociatedAreasBarangayStore) {
      super(store);
   }
}