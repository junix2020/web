import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AreaStatusTypePicklistState, AreaStatusTypePicklistStore } from './area-status-type-picklist.store';

@Injectable({
  providedIn: 'root'
})
export class AreaStatusTypePicklistQuery extends QueryEntity<AreaStatusTypePicklistState> {
  constructor(protected store: AreaStatusTypePicklistStore) {
    super(store);
  }

}
