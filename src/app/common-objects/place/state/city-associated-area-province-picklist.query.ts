import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CityAssociatedAreasProvinceState, CityAssociatedAreasProvinceStore } from './city-associated-area-province-picklist.store';


@Injectable({
   providedIn: 'root'
})
export class CityAssociatedAreasProvinceQuery extends QueryEntity<CityAssociatedAreasProvinceState> {
   constructor(protected store: CityAssociatedAreasProvinceStore) {
      super(store);
   }
}