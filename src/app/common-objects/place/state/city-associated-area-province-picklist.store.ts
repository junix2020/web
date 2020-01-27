import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { CityAssociatedAreaProvinceDTO } from '../dto/city-associated-area-province-picklist.dto';


export interface CityAssociatedAreasProvinceState extends EntityState<CityAssociatedAreaProvinceDTO> { }


@Injectable({
   providedIn: 'root'
})
@StoreConfig({ name: 'area', idKey: 'areaID' })
export class CityAssociatedAreasProvinceStore extends EntityStore<CityAssociatedAreasProvinceState> {
   constructor() {
      super();
   }
}