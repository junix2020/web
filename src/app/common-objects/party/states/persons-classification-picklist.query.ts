import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PersonsClassificationPicklistStore, PersonsClassificationPicklistState } from './persons-classification-picklist.store';


@Injectable({
  providedIn: 'root'
})
export class PersonsClassificationPicklistQuery extends QueryEntity<PersonsClassificationPicklistState> {
  constructor(protected store: PersonsClassificationPicklistStore) {
    super(store);
  }

}
