import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { GoodTypeService } from '@web/graphql';
import { GoodType } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoodTypeResolver implements Resolve<GoodType> {
  constructor(private service: GoodTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<GoodType> | Promise<GoodType> | GoodType {
    return this.service.findByID(route.paramMap.get('categoryTypeID'));
  }
}
