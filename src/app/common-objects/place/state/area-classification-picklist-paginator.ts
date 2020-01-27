import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { AreaClassificationsPicklistQuery } from './area-classification-picklist.query';


export const AREACLASSIFICATIONS_PAGINATOR = new InjectionToken('AREACLASSIFICATIONS_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const areaClassificationsPicklistQuery = inject(AreaClassificationsPicklistQuery);
    return new PaginatorPlugin(areaClassificationsPicklistQuery).withControls().withRange();
  }
});
