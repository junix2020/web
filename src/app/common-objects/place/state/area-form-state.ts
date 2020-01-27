import { AreaClassification } from '../models/area-classification.model';
import { AssociatedAreaDTO } from '../dto/associated-area.dto';

export interface AreaFormsState {
  newForm: {
   areaTypeAreaID
   areaTypeName
   areaID: string;
   code: string;
   name: string;
   description: string;
   permanentRecordIndicator: string;
   colorID: string;
   statusTypeID: string;
   statusName: string;
   provinceAreaID: string;
   provinceName: string;
   areaClassifications: Array<{
    areaClassificationID: string;
    startDateTime: Date;
    endDateTime: Date;
    primaryTypeIndicator: string;
    areaID: string;
    categoryTypeName: string;
    categoryTypeID: string;
    subCategoryTypeID: string;
    mutuallyExclusiveIndicator: string;
    }>;
    associatedAreas: Array<{
      areaAssociationID: string;
      associationTypeID: string;
      associationTypeName: string;
      subjectAreaID: string;
      subjectAreaName: string;
      associatedAreaID: string;
      associatedAreaName: string;
      areaID: string;
      areaCode: string;
      areaName: string;
      areaDescription;
      areaPermanentRecordIndicator;
      areaStatusID: string;
      areaStatusName: string;
    }>
  }
}
