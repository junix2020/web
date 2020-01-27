import { Injectable } from '@angular/core';
import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { OrganizationsListDTO } from '../dtos/organizations-list.dto';

export interface OrganizationsListState extends EntityState<OrganizationsListDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'organizations', idKey: 'partyID' })
export class OrganizationsListStore extends EntityStore<OrganizationsListState> {
  constructor() {
    super();
  }
}
