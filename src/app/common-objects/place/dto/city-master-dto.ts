import { CityAreaClassificationDetailDTO } from './city-area-classification-detail.dto';
import { CityAssociatedAreaDetailDTO } from './city-associated-area-detail.dto';

export class CityMasterDTO {
   areaTypeAreaID: string;
   areaTypeName: string;
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
   areaClassifications: CityAreaClassificationDetailDTO[];
   associatedAreas: CityAssociatedAreaDetailDTO[];
}

