import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { ServiceService } from '@web/graphql';
import { Service } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceResolver implements Resolve<Service> {
  constructor(private service: ServiceService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Service> | Promise<Service> | Service {
    return this.service.findByID(route.paramMap.get('productID'));
  }
}
