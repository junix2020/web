import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@web-environment/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AreaClassificationPicklistDTO } from '../dto/area-classification-picklist.dto';
import { AreaClassificationsPicklistStore } from '../state/area-classification-picklist.store';


@Injectable({
  providedIn: 'root'
})
export class AreaClassificationsPicklistService {
  constructor(
     private http: HttpClient,
     private areaClassificationsPicklistStore: AreaClassificationsPicklistStore
  ) { }

// method to retrieve data(s) from server
   getAreaClassifications(): Observable<AreaClassificationPicklistDTO[]> {
      const request = this.http
         .get<AreaClassificationPicklistDTO[]>(`${environment.apiUrl}/areaclassification`).pipe(
            tap(res => {
               this.areaClassificationsPicklistStore.set(res);
            }
            ));
      return request;
   }

}
