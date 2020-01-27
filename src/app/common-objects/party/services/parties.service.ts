import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd';
import { PersonsListStore } from '../states/persons-list.store';
import { PersonsListQuery } from '../states/persons-list.query';
import { Observable } from 'rxjs';
import { PersonsListDTO } from '../dtos/persons-list.dto';
import { environment } from '../../../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { ID, cacheable } from '@datorama/akita';
import * as uuid from "uuid";
import { ErrorService } from './errors.service';
import { PersonsFormDTO } from '../dtos/persons-form.dto';
import { Party, Person, PartyStatus, PartyClassification, Organization } from '../models/parties-post.model';
import { PartiesClassificationListDTO } from '../dtos/parties-classification-list.dto';
import { OrganizationsListDTO } from '../dtos/organizations-list.dto';
import { OrganizationsListStore } from '../states/organizations-list.store';
import { OrganizationsListQuery } from '../states/organizations-list.query';
import { OrganizationFormDTO } from '../dtos/organizations-form.dto';
import { PartiesPostDTO } from '../dtos/parties-post.dto';
import { PartiesStatusListDTO } from '../dtos/parties-status-list.dto';
import { PersonsClassificationPicklistStore } from '../states/persons-classification-picklist.store';
import { OrganizationsClassificationPicklistStore } from '../states/organizations-classification-picklist.store';
import { PersonsClassificationPicklistQuery } from '../states/persons-classification-picklist.query';
import { PersonsStatusPicklistStore } from '../states/persons-status-picklist.store';
import { OrganizationsStatusPicklistStore } from '../states/organizations-status-picklist.store';

@Injectable()
export class PartiesService {
  party = new Party();
  person = new Person();
  organization = new Organization();
  partyStatus = new PartyStatus();
  partyClassification = new PartyClassification();

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService,
    private personsListStore: PersonsListStore,
    private personsListQuery: PersonsListQuery,
    private organizationsListStore: OrganizationsListStore,
    private organizationsListQuery: OrganizationsListQuery,
    private personsClassificationPicklistStore: PersonsClassificationPicklistStore,
    private personsClassificationPicklistQuery: PersonsClassificationPicklistQuery,
    private organizationsClassificationPicklistStore: OrganizationsClassificationPicklistStore,
    private personsStatusPicklistStore: PersonsStatusPicklistStore,
    private organizationsStatusPicklistStore: OrganizationsStatusPicklistStore,
    private errorService: ErrorService
  ) {

  }

  getPersonsList(): Observable<PersonsListDTO[]> {
    return this.http
      .get<PersonsListDTO[]>(`${environment.apiUrl}/parties/persons`).pipe(
        tap(res => {
          this.personsListStore.set(res);
        }
      ));
  }

  getOrganizationsList(): Observable<OrganizationsListDTO[]> {
    return this.http
      .get<OrganizationsListDTO[]>(`${environment.apiUrl}/parties/organizations`).pipe(
        tap(res => {
          this.organizationsListStore.set(res);
        })
      );
  }

  savePerson(personsFormDto: PersonsFormDTO, status: string) {
    var party = {};
    var person = {};
    var partyStatus = {};
    var partyClassifications = [];

    // assign party
    {
      this.party.partyID = personsFormDto.partyID;
      this.party.code = personsFormDto.code;
      this.party.name = personsFormDto.name;
      this.party.description = personsFormDto.description;
      this.party.permanentRecordIndicator = personsFormDto.permanentRecordIndicator ? 'Y' : 'N';;
      this.party.colorID = personsFormDto.colorID;
      party = Object.assign({}, this.party);
    }
    // assign person
    {
      this.person.partyID = personsFormDto.personPartyID;
      this.person.firstName = personsFormDto.firstName;
      this.person.middleName = personsFormDto.middleName;
      this.person.lastName = personsFormDto.lastName;
      this.person.birthDate = personsFormDto.birthDate;
      person = Object.assign({}, this.person);
    }
     // assign party status
    {
      this.partyStatus.partyStatusID = personsFormDto.partyStatusID;
      this.partyStatus.startDateTime = personsFormDto.startDateTime;
      this.partyStatus.endDateTime = personsFormDto.endDateTime;
      this.partyStatus.partyID = personsFormDto.partyStatusPartyID;
      this.partyStatus.statusTypeID = personsFormDto.statusTypeID;
      partyStatus = Object.assign({}, this.partyStatus);
    }

    // assign party classification
    if (personsFormDto.classifications.length > 0) {
      personsFormDto.classifications.map(o => {
        this.partyClassification.partyClassificationID = o.partyClassificationID
        this.partyClassification.startDateTime = o.startDateTime;
        this.partyClassification.endDateTime = null;
        this.partyClassification.primaryTypeIndicator = null;
        this.partyClassification.partyID = personsFormDto.partyID;
        this.partyClassification.categoryTypeID = o.categoryTypeID;
        partyClassifications.push(Object.assign({}, this.partyClassification));
      })
    }

    var body = {
      party: party,
      person: person,
      partyStatus: partyStatus,
      partyClassifications: partyClassifications
    }

    return this.http.post<PartiesPostDTO>(`${environment.apiUrl}/parties/save/person`, body)
      .pipe(
        catchError(this.errorService.handleError)

    ).subscribe(res => {
      if (status == 'edit' || status == 'view' || status == 'new') {
        this.personsListStore.upsert(personsFormDto.partyID, {
            code: personsFormDto.code,
            name: personsFormDto.name,
            description: personsFormDto.description,
            firstName: personsFormDto.firstName,
            lastName: personsFormDto.lastName,
            statusTypeID: personsFormDto.statusTypeID,
            status: personsFormDto.statusName

          })
      }
         this.sendNotification('Save Succesfully!');
      })

  }

  saveOrganization(organizationsFormDto: OrganizationFormDTO, status: string) {
    var party = {};
    var organization = {};
    var partyStatus = {};
    var partyClassifications = [];

    // assign party
    {
      this.party.partyID = organizationsFormDto.partyID;
      this.party.code = organizationsFormDto.code;
      this.party.name = organizationsFormDto.name;
      this.party.description = organizationsFormDto.description;
      this.party.permanentRecordIndicator = organizationsFormDto.permanentRecordIndicator ? 'Y' : 'N';;
      this.party.colorID = organizationsFormDto.colorID;
      party = Object.assign({}, this.party);
    }

    // assign organization
    {
      this.organization.partyID = organizationsFormDto.organizationPartyID;
      this.organization.officialName = organizationsFormDto.officialName;
      this.organization.creationDate = organizationsFormDto.creationDate;
      organization = Object.assign({}, this.organization);
    }

    // assign party status
    {
      this.partyStatus.partyStatusID = organizationsFormDto.partyStatusID;
      this.partyStatus.startDateTime = organizationsFormDto.startDateTime;
      this.partyStatus.endDateTime = organizationsFormDto.endDateTime;
      this.partyStatus.partyID = organizationsFormDto.partyStatusPartyID;
      this.partyStatus.statusTypeID = organizationsFormDto.statusTypeID;
      partyStatus = Object.assign({}, this.partyStatus);
    }

    // assign party classification
    if (organizationsFormDto.classifications.length > 0) {
      organizationsFormDto.classifications.map(o => {
        this.partyClassification.partyClassificationID = o.partyClassificationID
        this.partyClassification.startDateTime = o.startDateTime;
        this.partyClassification.endDateTime = null;
        this.partyClassification.primaryTypeIndicator = null;
        this.partyClassification.partyID = organizationsFormDto.partyID;
        this.partyClassification.categoryTypeID = o.categoryTypeID;
        partyClassifications.push(Object.assign({}, this.partyClassification));
      })
    }

    var body = {
      party: party,
      organization: organization,
      partyStatus: partyStatus,
      partyClassifications: partyClassifications
    }

    return this.http.post<PartiesPostDTO>(`${environment.apiUrl}/parties/save/organization`, body)
      .pipe(
        catchError(this.errorService.handleError)

      ).subscribe(res => {
        if (status == 'edit' || status == 'view' || status == 'new') {
          this.organizationsListStore.upsert(organizationsFormDto.partyID, {
            code: organizationsFormDto.code,
            name: organizationsFormDto.name,
            description: organizationsFormDto.description,
            officialName: organizationsFormDto.officialName,
            statusTypeID: organizationsFormDto.statusTypeID,
            status: organizationsFormDto.statusName

          })
        }
        this.sendNotification('Save Succesfully!');
      })

  }

  // retrieve person using party id
  getPersonByID(partyId: string): Observable<PersonsFormDTO> {
    if (partyId != undefined || partyId != null) {
      return this.http.get<PersonsFormDTO>(`${environment.apiUrl}/parties/person/${partyId}`);
    }
  }

  // retrieve organization using party id
  getOrganizationByID(partyId: string): Observable<OrganizationFormDTO> {
    if (partyId != undefined || partyId != null) {
      return this.http.get<OrganizationFormDTO>(`${environment.apiUrl}/parties/organization/${partyId}`);
    }
  }

  getPartyClassifications(categoryTypeID: string, source: string): Observable<PartiesClassificationListDTO[]> {
    if (categoryTypeID == undefined || categoryTypeID == null) {
      return;
    }
    return this.http.get<PartiesClassificationListDTO[]>(`${environment.apiUrl}/parties/party/classifications/${categoryTypeID}`).pipe(
      tap(res => {
        this.setPartyStore(res, source);
      })
     )
  }

 setPartyStore(classifications: PartiesClassificationListDTO[], source: string ) {
    switch (source) {
      case 'person':
        this.personsClassificationPicklistStore.set(classifications);
        break;
      case 'organization':
        this.organizationsClassificationPicklistStore.set(classifications);
        break;
      default:
        break;
    }
  }

  getPartiesStatus(associationTypeId: string, statusTypeId: string, source: string): Observable<PartiesStatusListDTO[]> {
    if (associationTypeId == undefined || associationTypeId == null || statusTypeId == undefined || statusTypeId == null) {
      return;
    }
     return this.http.get<PartiesStatusListDTO[]>(`${environment.apiUrl}/parties/party/status/${associationTypeId}/${statusTypeId}`).pipe(
      tap(res => {
        this.setPartyStatusStore(res, source);
      }
      ));
  }

  setPartyStatusStore(status: PartiesStatusListDTO[], source: string) {
    switch (source) {
      case 'person':
        this.personsStatusPicklistStore.set(status);
        break;
      case 'organization':
        this.organizationsStatusPicklistStore.set(status);
        break;
      default:
        break;
    }
  }

  // delete multiple person party ids
  deletePartyByIDs(partyIds: ID[], source: string) {
    if (partyIds.length < 1) {
      return;
    }
    return this.http.post<void>(`${environment.apiUrl + '/parties'}/delete/party`, partyIds).pipe(
      tap(() => this.deletePartyStore(partyIds, source))
    ).subscribe();
  }

  deletePartyStore(partyIds: ID[], source: string) {
    switch (source) {
      case 'person':
        this.personsListStore.remove(partyIds);
        break;
      case 'organization':
        this.organizationsListStore.remove(partyIds);
        break;
      default:
        break;
    }
  }

  deletePartyClassificationByIDs(partyClassificationIds: ID[]) {
    if (partyClassificationIds.length < 1) {
      return;
    }
    this.http.post<void>(`${environment.apiUrl + '/parties'}/delete/classifications`, partyClassificationIds).toPromise();
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

 }
