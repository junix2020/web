import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PersonsListState, PersonsListStore } from './persons-list.store';
import { PersonsListDTO } from '../dtos/persons-list.dto';

@Injectable({
  providedIn: 'root'
})
export class PersonsListQuery extends QueryEntity<PersonsListState> {
  constructor(protected store: PersonsListStore) {
    super(store);
  }
}
