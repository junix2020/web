import { Injectable } from '@angular/core';
import { StoreConfig, EntityState, EntityStore } from '@datorama/akita';
import { PartiesClassificationListDTO } from '../dtos/parties-classification-list.dto';

export interface PersonsClassificationPicklistState extends EntityState<PartiesClassificationListDTO> { }

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'PersonClassification', idKey: 'categoryTypeID' })
export class PersonsClassificationPicklistStore extends EntityStore<PersonsClassificationPicklistState> {
  constructor() {
    super();
  }
}
