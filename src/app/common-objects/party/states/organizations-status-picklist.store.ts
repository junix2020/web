import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { PartiesStatusListDTO } from '../dtos/parties-status-list.dto';
import { Injectable } from '@angular/core';


export interface OrganizationsStatusPicklistState extends EntityState<PartiesStatusListDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'OrganizationsStatusPicklist', idKey: 'statusTypeId' })
export class OrganizationsStatusPicklistStore extends EntityStore<OrganizationsStatusPicklistState> {
  constructor() {
    super();
  }
}
