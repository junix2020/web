import { Injectable } from '@angular/core';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { AreaClassificationPicklistDTO } from '../dto/area-classification-picklist.dto';

export interface AreaClassificationsPicklistState extends EntityState<AreaClassificationPicklistDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'areaClassficationPicklist', idKey: 'categoryTypeID' })
export class AreaClassificationsPicklistStore extends EntityStore<AreaClassificationsPicklistState> {
  constructor() {
    super();
  }
}
