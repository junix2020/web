import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationResponse } from '@datorama/akita';
import { environment } from '../../../../environments/environment';
import { CityAssociatedAreaProvinceDTO } from '../dto/city-associated-area-province-picklist.dto';
import { CityAssociatedAreasProvinceStore } from '../state/city-associated-area-province-picklist.store';
import { tap } from 'rxjs/operators';


@Injectable({
   providedIn: 'root'
})
export class CityAssociatedAreasProvincePicklistService {
   constructor(
      private http: HttpClient,
      private cityAssociatedAreasProvinceStore: CityAssociatedAreasProvinceStore
   ) { }


   //getPage(params): Observable<PaginationResponse<CityAssociatedAreaProvinceDTO>> {
   //   return this.http
   //      .get<PaginationResponse<CityAssociatedAreaProvinceDTO>>(`${environment.apiUrl}/province-picklist`, {
   //         params
   //      })
   //}

   getProvinces(): Observable<CityAssociatedAreaProvinceDTO[]> {
      const request = this.http
         .get<CityAssociatedAreaProvinceDTO[]>(`${environment.apiUrl}/province-picklist`).pipe(
            tap(res => {
               this.cityAssociatedAreasProvinceStore.set(res);
            }
            ));
      return request;
   }

}