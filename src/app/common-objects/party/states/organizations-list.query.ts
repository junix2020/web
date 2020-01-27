import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OrganizationsListState, OrganizationsListStore } from './organizations-list.store';


@Injectable({
  providedIn: 'root'
})
export class OrganizationsListQuery extends QueryEntity<OrganizationsListState> {
  constructor(protected store: OrganizationsListStore) {
    super(store);
  }
}
