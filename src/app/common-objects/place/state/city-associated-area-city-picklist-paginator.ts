import { InjectionToken, inject } from '@angular/core';
import { CityAssociatedAreasCityQuery } from './city-associated-area-city-picklist.query';
import { PaginatorPlugin } from '@datorama/akita';


export const CITY_ASSOCIATED_AREA_CITY_PICKLIST_PAGINATOR = new InjectionToken('CITY_ASSOCIATED_AREA_CITY_PICKLIST_PAGINATOR', {
   providedIn: 'root',
   factory: () => {
      const cityAssociatedAreaCityPicklistQuery = inject(CityAssociatedAreasCityQuery);
      return new PaginatorPlugin(cityAssociatedAreaCityPicklistQuery).withControls().withRange();
   }
});