
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig, HashMap } from '@datorama/akita';
import { PersonsListDTO } from '../dtos/persons-list.dto';

export interface PersonsListState extends EntityState<PersonsListDTO> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'persons', idKey: 'partyID' })
export class PersonsListStore extends EntityStore<PersonsListState> {
  constructor() {
    super();
  }
}
