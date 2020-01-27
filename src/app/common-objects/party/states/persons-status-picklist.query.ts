import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PersonsStatusPicklistState, PersonsStatusPicklistStore } from './persons-status-picklist.store';

@Injectable({
  providedIn: 'root'
})
export class PersonsStatusPicklistQuery extends QueryEntity<PersonsStatusPicklistState> {
  constructor(protected store: PersonsStatusPicklistStore) {
    super(store);
  }

}
