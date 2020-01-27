import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { AreasQuery } from './areas.query';



export const AREA_PAGINATOR = new InjectionToken('AREA_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const areasQuery = inject(AreasQuery);
    return new PaginatorPlugin(areasQuery).withControls().withRange();
  }
});
