import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CityAssociatedAreaBarangayDTO } from '../dto/city-associated-area-barangay-picklist.dto';
import { CityAssociatedAreasBarangayStore } from '../state/city-associated-area-barangay-picklist.store';

@Injectable({
   providedIn: 'root'
})
export class CityAssociatedAreasBarangayPicklistService {
   constructor(
      private http: HttpClient,
      private cityAssociatedAreasBarangayStore: CityAssociatedAreasBarangayStore
   ) { }


   //getPage(params): Observable<PaginationResponse<CityAssociatedAreaBarangayDTO>> {
   //   return this.http
   //      .get<PaginationResponse<CityAssociatedAreaBarangayDTO>>(`${environment.apiUrl}/barangay-picklist`, {
   //         params
   //      })
   //}

   getCityAreaBarangays(): Observable<CityAssociatedAreaBarangayDTO[]> {
      const request = this.http
         .get<CityAssociatedAreaBarangayDTO[]>(`${environment.apiUrl}/barangay-picklist`).pipe(
            tap(res => {
               this.cityAssociatedAreasBarangayStore.set(res);
            }
            ));
      return request;
   }

}