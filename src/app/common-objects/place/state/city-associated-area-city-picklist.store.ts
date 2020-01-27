import { Injectable } from '@angular/core';
import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { CityAssociatedAreaCityDTO } from '../dto/city-associated-area-city-picklist.dto';

export interface CityAssociatedAreasCityState extends EntityState<CityAssociatedAreaCityDTO> { }

@Injectable({
   providedIn: 'root'
})
@StoreConfig({ name: 'area', idKey: 'areaID' })
export class CityAssociatedAreasCityStore extends EntityStore<CityAssociatedAreasCityState> {
   constructor() {
      super();
   }
}