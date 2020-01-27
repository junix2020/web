import { AreaClassification } from '../models/area-classification.model';
import { AreaAssociation } from '../models/area-association.model';

export class CityDTO {
   areaID: string;
   code: string;
   name: string;
   description: string;
   colorID: string;
   statusTypeID: string;
   permanentRecordIndicator: string;
   areaClassifications: AreaClassification[];
   associatedAreas: AreaAssociation[];
}