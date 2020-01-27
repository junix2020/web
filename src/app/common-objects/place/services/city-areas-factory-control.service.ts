import { AreaClassificationDTO } from '../dto/area-classification.dto'
import { AssociatedAreaDTO } from '../dto/associated-area.dto'
import { Injectable } from '@angular/core'
import { FormBuilder } from '@angular/forms'

@Injectable({
    providedIn: 'root'
})
export class CityAreaFactoryService  {
    // factory control for area classification
   areaClassificationControl = (areaClassification: AreaClassificationDTO) => this.fb.group({
        areaClassificationID: areaClassification.areaClassificationID,
        startDateTime: areaClassification.startDateTime,
        endDateTime: areaClassification.endDateTime,
        primaryTypeIndicator: areaClassification.primaryTypeIndicator,
        areaID: areaClassification.areaID,
        categoryTypeName: areaClassification.categoryTypeName,
        categoryTypeID: areaClassification.categoryTypeID,
        subCategoryTypeID: areaClassification.subCategoryTypeID,
        mutuallyExclusiveIndicator: areaClassification.mutuallyExclusiveIndicator
    })

    // factory control for associated area
    associatedAreaControl = (associatedArea: AssociatedAreaDTO) => this.fb.group({
        areaAssociationID: associatedArea.areaAssociationID,
        associationTypeID: associatedArea.associationTypeID,
        associationTypeName: associatedArea.associationTypeName,
        subjectAreaID: associatedArea.subjectAreaID,
        subjectAreaName: associatedArea.subjectAreaName,
        associatedAreaID: associatedArea.associatedAreaID,
        associatedAreaName: associatedArea.associatedAreaName,
        areaID: associatedArea.areaID,
        areaCode: associatedArea.areaCode,
        areaName: associatedArea.areaName,
        areaDescription: associatedArea.areaDescription,
        areaPermanentRecordIndicator: associatedArea.areaPermanentRecordIndicator,
        areaStatusID: associatedArea.areaStatusID,
        areaStatusName: associatedArea.areaStatusName
    })

    constructor(
        private fb: FormBuilder
    ) { }

}
