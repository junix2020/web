import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AreaDTO } from '../dto/area.dto';

export interface AreasState extends EntityState<AreaDTO> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'area', idKey: 'areaID' })
export class AreasStore extends EntityStore<AreasState> {
  constructor() {
    super();
  }
}
