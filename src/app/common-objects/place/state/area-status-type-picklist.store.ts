import { Injectable } from '@angular/core';
import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { AreaStatusTypeDTO } from '../dto/area-status-type-picklist.dto';

export interface AreaStatusTypePicklistState extends EntityState<AreaStatusTypeDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'areaStatusTypePicklist', idKey: 'statusTypeAssociationID', resettable: true })
export class AreaStatusTypePicklistStore extends EntityStore<AreaStatusTypePicklistState> {
  constructor() {
    super();
  }
}
