import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { PartiesStatusListDTO } from '../dtos/parties-status-list.dto';
import { Injectable } from '@angular/core';

export interface PersonsStatusPicklistState extends EntityState<PartiesStatusListDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'PersonsStatusPicklist', idKey: 'statusTypeId' })
export class PersonsStatusPicklistStore extends EntityStore<PersonsStatusPicklistState> {
  constructor() {
    super();
  }
}
