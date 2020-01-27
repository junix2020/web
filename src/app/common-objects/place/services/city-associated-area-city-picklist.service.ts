import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CityAssociatedAreaBarangayDTO } from '../dto/city-associated-area-barangay-picklist.dto';
import { PaginationResponse } from '@datorama/akita';
import { CityAssociatedAreaCityDTO } from '../dto/city-associated-area-city-picklist.dto';
import { environment } from '../../../../environments/environment';
import { CityAssociatedAreasCityStore } from '../state/city-associated-area-city-picklist.store';
import { tap } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class CityAssociatedAreasCityPicklistService {
   constructor(
      private http: HttpClient,
      private cityAssociatedAreasCityStore: CityAssociatedAreasCityStore
   ) { }


   //getPage(params): Observable<PaginationResponse<CityAssociatedAreaCityDTO>> {
   //   return this.http
   //      .get<PaginationResponse<CityAssociatedAreaCityDTO>>(`${environment.apiUrl}/city-picklist`, {
   //         params
   //      })
   //}

   getCityAreaCities(): Observable<CityAssociatedAreaCityDTO[]> {
      const request = this.http
         .get<CityAssociatedAreaCityDTO[]>(`${environment.apiUrl}/city-picklist`).pipe(
            tap(res => {
               this.cityAssociatedAreasCityStore.set(res);
            }
            ));
      return request;
   }

}