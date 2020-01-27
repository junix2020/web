import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { PartiesClassificationListDTO } from '../dtos/parties-classification-list.dto';
import { Injectable } from '@angular/core';


export interface OrganizationsClassificationPicklistState extends EntityState<PartiesClassificationListDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'organizationClassification', idKey: 'categoryTypeID' })
export class OrganizationsClassificationPicklistStore extends EntityStore<OrganizationsClassificationPicklistState> {
  constructor() {
    super();
  }
}
