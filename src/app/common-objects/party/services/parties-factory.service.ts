import { Injectable } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { PartiesClassificationDTO } from '../dtos/parties-classification.dto'


@Injectable({
  providedIn: 'root'
})
export class PartiesFactoryService {
  // factory control for area classification
  partiesClassificationControl = (partiesClassification: PartiesClassificationDTO) => this.fb.group({
    partyClassificationID: partiesClassification.partyClassificationID,
    startDateTime: partiesClassification.startDateTime,
    endDateTime: partiesClassification.endDateTime,
    primaryTypeIndicator: partiesClassification.primaryTypeIndicator,
    partyID: partiesClassification.partyID,
    categoryTypeName: partiesClassification.categoryTypeName,
    categoryTypeID: partiesClassification.categoryTypeID,
  })

  //// factory control for associated area
  //associatedAreaControl = (associatedArea: AssociatedAreaDTO) => this.fb.group({
  //  areaAssociationID: associatedArea.areaAssociationID,
  //  associationTypeID: associatedArea.associationTypeID,
  //  associationTypeName: associatedArea.associationTypeName,
  //  subjectAreaID: associatedArea.subjectAreaID,
  //  subjectAreaName: associatedArea.subjectAreaName,
  //  associatedAreaID: associatedArea.associatedAreaID,
  //  associatedAreaName: associatedArea.associatedAreaName,
  //  areaID: associatedArea.areaID,
  //  areaCode: associatedArea.areaCode,
  //  areaName: associatedArea.areaName,
  //  areaDescription: associatedArea.areaDescription,
  //  areaPermanentRecordIndicator: associatedArea.areaPermanentRecordIndicator,
  //  areaStatusID: associatedArea.areaStatusID,
  //  areaStatusName: associatedArea.areaStatusName
  //})

  constructor(
    private fb: FormBuilder
  ) { }

}
