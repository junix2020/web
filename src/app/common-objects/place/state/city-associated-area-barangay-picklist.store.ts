import { Injectable } from '@angular/core';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { CityAssociatedAreaBarangayDTO } from '../dto/city-associated-area-barangay-picklist.dto';

export interface CityAssociatedAreasBarangayState extends EntityState<CityAssociatedAreaBarangayDTO> { }


@Injectable({
   providedIn: 'root'
})
@StoreConfig({ name: 'area', idKey: 'areaID' })
export class CityAssociatedAreasBarangayStore extends EntityStore<CityAssociatedAreasBarangayState> {
   constructor() {
      super();
   }
}