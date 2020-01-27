import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { Injectable } from '@angular/core';
import { AreasStore, AreasState } from '../state/areas.store';

@Injectable({
providedIn: 'root'
})
export class CityAreasStoreService extends NgEntityService<AreasState> {
   constructor(protected store: AreasStore) {
      super(store);
   }
}