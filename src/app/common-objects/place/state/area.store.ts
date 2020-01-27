import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Area } from './area.model';

export interface AreaState extends EntityState<Area> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'area', idKey: 'areaID' })
export class AreaStore extends EntityStore<AreaState> {
  constructor() {
    super();
  }
}
