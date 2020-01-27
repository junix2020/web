import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AreaStatusTypeDTO } from '../dto/area-status-type-picklist.dto';

@Injectable({
  providedIn: 'root'
})
export class AreaStatusTypePicklistService {
  constructor(
    private http: HttpClient,
  ) { }

// method to retrieve data from the server
     getPage(params): Observable<AreaStatusTypeDTO> {
      return this.http
         .get<AreaStatusTypeDTO>(`${environment.apiUrl}/area-status`, {
            params
         })
      }

}
