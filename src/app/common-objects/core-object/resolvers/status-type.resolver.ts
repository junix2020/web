import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { StatusTypeService } from '@web/graphql';
import { StatusType } from '@web/graphql/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatusTypeResolver implements Resolve<StatusType> {
  constructor(private service: StatusTypeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<StatusType> | Promise<StatusType> | StatusType {
    const statusTypeID = route.paramMap.get('statusTypeID');
    return this.service.findByID(statusTypeID);
  }
}
