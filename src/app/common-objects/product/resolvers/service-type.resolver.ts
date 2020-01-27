import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { ServiceTypeService } from '@web/graphql';
import { ServiceType } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceTypeResolver implements Resolve<ServiceType> {
  constructor(private service: ServiceTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<ServiceType> | Promise<ServiceType> | ServiceType {
    return this.service.findByID(route.paramMap.get('categoryTypeID'));
  }
}
