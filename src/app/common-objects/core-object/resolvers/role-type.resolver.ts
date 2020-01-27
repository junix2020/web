import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { RoleTypeService } from '@web/graphql';
import { RoleType } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleTypeResolver implements Resolve<RoleType> {
  constructor(private service: RoleTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<RoleType> | Promise<RoleType> | RoleType {
    const categoryTypeID = route.paramMap.get('roleTypeID');
    return this.service.findByID(categoryTypeID);
  }
}
