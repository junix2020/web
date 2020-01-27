import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AreaClassificationsPicklistState, AreaClassificationsPicklistStore } from './area-classification-picklist.store';


@Injectable({
  providedIn: 'root'
})
export class AreaClassificationsPicklistQuery extends QueryEntity<AreaClassificationsPicklistState> {
  constructor(protected store: AreaClassificationsPicklistStore) {
    super(store);
  }

 }
