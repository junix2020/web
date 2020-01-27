import { InjectionToken, inject } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { CityAssociatedAreasProvinceQuery } from './city-associated-area-province-picklist.query';
import { CityAssociatedAreasBarangayQuery } from './city-associated-area-barangay-picklist.query';

export const CITY_ASSOCIATED_AREA_BARANGAY_PICKLIST_PAGINATOR = new InjectionToken('CITY_ASSOCIATED_AREA_BARANGAY_PICKLIST_PAGINATOR', {
   providedIn: 'root',
   factory: () => {
      const cityAssociatedAreaBarangayPicklistQuery = inject(CityAssociatedAreasBarangayQuery);
      return new PaginatorPlugin(cityAssociatedAreaBarangayPicklistQuery).withControls().withRange();
   }
});