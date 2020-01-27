import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CityAssociatedAreasCityState, CityAssociatedAreasCityStore } from './city-associated-area-city-picklist.store';

@Injectable({
   providedIn: 'root'
})
export class CityAssociatedAreasCityQuery extends QueryEntity<CityAssociatedAreasCityState> {
   constructor(protected store: CityAssociatedAreasCityStore) {
      super(store);
   }
}