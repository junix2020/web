import { InjectionToken, inject } from '@angular/core';
import { CityAssociatedAreasProvinceQuery } from './city-associated-area-province-picklist.query';
import { PaginatorPlugin } from '@datorama/akita';

export const CITY_ASSOCIATED_AREA_PROVINCE_PICKLIST_PAGINATOR = new InjectionToken('CITY_ASSOCIATED_AREA_PROVINCE_PICKLIST_PAGINATOR', {
   providedIn: 'root',
   factory: () => {
      const cityAssociatedAreaProvincePicklistQuery = inject(CityAssociatedAreasProvinceQuery);
      return new PaginatorPlugin(cityAssociatedAreaProvincePicklistQuery).withControls().withRange();
   }
});