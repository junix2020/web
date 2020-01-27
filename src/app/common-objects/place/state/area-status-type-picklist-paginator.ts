import { InjectionToken, inject } from '@angular/core';
import { AreaStatusTypePicklistQuery } from './area-status-type-picklist.query';
import { PaginatorPlugin } from '@datorama/akita';

export const AREASTATUSTYPE_PAGINATOR = new InjectionToken('AREASTATUSTYPE_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const areaStatusTypePicklistQuery = inject(AreaStatusTypePicklistQuery);
    return new PaginatorPlugin(areaStatusTypePicklistQuery).withControls().withRange();
  }
});
