import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { AssociationTypeService } from '@web/graphql';
import { AssociationType } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssociationTypeResolver implements Resolve<AssociationType> {
  constructor(private service: AssociationTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<AssociationType> | Promise<AssociationType> | AssociationType {
    const associationTypeID = route.paramMap.get('associationTypeID');
    return this.service.findByID(associationTypeID);
  }
}
