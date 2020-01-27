import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AreaState, AreaStore } from './area.store';

@Injectable({ providedIn: 'root' })
export class AreaQuery extends QueryEntity<AreaState> {
  provinces$ = this.selectAll({
    filterBy: area => area.areaType === 'Province'
  });
  countries$ = this.selectAll({
    filterBy: area => area.areaType === 'Country'
  });

  constructor(protected store: AreaStore) {
    super(store);
  }
}
