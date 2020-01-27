import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Area } from './area.model';
import { AreaService } from './area.service';

@Injectable({ providedIn: 'root' })
export class AreaResolver implements Resolve<Area> {
  constructor(private service: AreaService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Area> | Promise<Area> | Area {
    const areaID = route.paramMap.get('areaID');
    return this.service.findByID(areaID);
  }
}
