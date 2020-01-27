import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AreasState, AreasStore } from './areas.store';


@Injectable({
  providedIn: 'root'
})
export class AreasQuery extends QueryEntity<AreasState> {
  constructor(protected store: AreasStore) {
    super(store);
  }
}
