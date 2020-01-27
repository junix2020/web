import { OrganizationsClassificationPicklistStore, OrganizationsClassificationPicklistState } from './organizations-classification-picklist.store';
import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class OrganizationsClassificationPicklistQuery extends QueryEntity<OrganizationsClassificationPicklistState> {
  constructor(protected store: OrganizationsClassificationPicklistStore) {
    super(store);
  }

}
