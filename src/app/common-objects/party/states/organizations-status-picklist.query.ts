import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OrganizationsStatusPicklistState, OrganizationsStatusPicklistStore } from './organizations-status-picklist.store';


@Injectable({
  providedIn: 'root'
})
export class OrganizationsStatusPicklistQuery extends QueryEntity<OrganizationsStatusPicklistState> {
  constructor(protected store: OrganizationsStatusPicklistStore) {
    super(store);
  }

}
