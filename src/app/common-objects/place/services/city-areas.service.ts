import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AreaDTO } from '../dto/area.dto';
import { CityMasterDTO } from '../dto/city-master-dto';
import { CityDTO } from '../dto/city.dto';
import { AreaAssociation } from '../models/area-association.model';
import { AreaClassification } from '../models/area-classification.model';
import { Area } from '../models/area.model';
import { AreasQuery } from '../state/areas.query';
import { AreasStore } from '../state/areas.store';


@Injectable()
export class CityAreasService {
   cityArea = new Area();
   areaClassifications = new AreaClassification();
   associatedAreas = new AreaAssociation();

   constructor(
      private http: HttpClient,
      private notification: NzNotificationService,
      private areasStore: AreasStore,
      private areasQuery: AreasQuery
   ) {
  
   }
   getCities(): Observable<AreaDTO[]> {
     return this.http
         .get<AreaDTO[]>(`${environment.apiUrl}/city`).pipe(
            tap(res => {
                this.areasStore.set(res);
            }
         ));
   }

   saveCityArea(data: CityMasterDTO, status: string) {
   //submitCityArea(data: CityMasterDTO):  {
      var cityArea = {};
      var areaClassifications = [];
      var cityAssociatedAreas = [];

      // get the master data
      {
         this.cityArea.areaID = data.areaID;
         this.cityArea.code = data.code;
         this.cityArea.name = data.name;
         this.cityArea.description = data.description;
         this.cityArea.colorID = data.colorID;
         this.cityArea.statusTypeID = data.statusTypeID;
         this.cityArea.permanentRecordIndicator = data.permanentRecordIndicator ? 'Y' : 'N';
         cityArea = Object.assign({}, this.cityArea);
      }
      // get the area classifications
      if (data.areaClassifications.length > 0) {
         data.areaClassifications.map(c => {
            this.areaClassifications.areaClassificationID = c.areaClassificationID;
            this.areaClassifications.startDateTime = c.startDateTime;
            this.areaClassifications.endDateTime = c.endDateTime;
            this.areaClassifications.primaryTypeIndicator = c.primaryTypeIndicator ? 'Y' : 'N';
            this.areaClassifications.areaID = c.areaID;
            this.areaClassifications.categoryTypeID = c.categoryTypeID;
            areaClassifications.push(Object.assign({}, this.areaClassifications));
         })
      }
      // get associated ares
      if (data.associatedAreas.length > 0) {
         data.associatedAreas.map(a => {
            this.associatedAreas.areaAssociationID = a.areaAssociationID;
            this.associatedAreas.associationTypeID = a.associationTypeID;
            this.associatedAreas.subjectAreaID = a.subjectAreaID;
            this.associatedAreas.associatedAreaID = a.associatedAreaID;
            cityAssociatedAreas.push(Object.assign({}, this.associatedAreas));
         })
      }
      
      var body = {
         ...cityArea,
         areaClassifications: areaClassifications,
         associatedAreas: cityAssociatedAreas
      }
      // console.log('body ', body);
      this.http.post<CityDTO>(`${environment.apiUrl + '/city'}/save`, body)
         .subscribe(res => {
            if (status == 'edit' || status == 'view') {
               this.areasStore.update(data.areaID, {
                  areaID: data.areaID,
                  code: data.code,
                  name: data.name,
                  description: data.description,
                  statusTypeID: data.statusTypeID,
                  statusName: data.statusName
               })
            } else if (status == 'new') {
                this.areasStore.upsert(data.areaID, {
                  code: data.code,
                  name: data.name,
                  description: data.description,
                  statusTypeID: data.statusTypeID,
                  statusName: data.statusName
               })
              
            }
             this.sendNotification('Save Succesfully!');
                      
         })
  
   }

   selectList(id: ID) {
      this.areasStore.setActive(id);
   }
 
   //getCityAreaByID(areaId: string): any {
   //   return this.http.get(`${environment.apiUrl}/city/${areaId}`).toPromise();
   //}

   getCityAreaByID(areaId: string): Observable<CityMasterDTO> {
      return this.http.get<CityMasterDTO>(`${environment.apiUrl}/city/${areaId}`);
    }

    // delete city area single or multiple ids
    deleteCityAreaByIDs(areaIDs: ID[]) {
      return this.http.post<Area>(`${environment.apiUrl + '/city'}/delete`, areaIDs).pipe(
            tap(() => this.areasStore.remove(areaIDs)),
        );
    }

    // delete booking batch by id
    deleteCityAreaByID(areaId: string): any {
        return this.http.delete<void>(`${environment.apiUrl}/city/${areaId}`)
            .pipe(
                tap(() => this.areasStore.remove(areaId))
            ).subscribe();
    }

   deleteCityAreaClassificationByID(areaClassificationId: string): any {
      this.http.delete<void>(`${environment.apiUrl}/city-area-classification/${areaClassificationId}`).toPromise();
   }

   deleteCityAssociatedAreaByID(areaAssociationId: string): any {
      this.http.delete<void>(`${environment.apiUrl}/city-associated-area/${areaAssociationId}`).toPromise();
   }

   sendNotification(errMsg: string): void {
      this.notification.blank(
         'Message!',
         errMsg,
         {
            nzStyle: {
               width: '600px',
               marginLeft: '-265px'
            },
            nzDuration: 4500,
            nzPauseOnHover: true,
            nzAnimate: true
         }

      );
   }

   removeStoreId(id: ID) {
      this.areasStore.remove(id);
   }

 
}
