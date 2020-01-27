import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { CategoryTypeService } from '@web/graphql';
import { CategoryType } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryTypeResolver implements Resolve<CategoryType> {
  constructor(private service: CategoryTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoryType> | Promise<CategoryType> | CategoryType {
    const categoryTypeID = route.paramMap.get('categoryTypeID');
    return this.service.findByID(categoryTypeID);
  }
}
