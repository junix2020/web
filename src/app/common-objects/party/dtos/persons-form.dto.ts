import { PartiesClassificationDTO } from './parties-classification.dto';

export class PersonsFormDTO {
  personCategoryTypeID: string;
  personCategoryTypeName: string;
  partyID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
  personPartyID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
  partyStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  partyStatusPartyID: string;
  statusName: string;
  statusTypeID: string;
  classifications: PartiesClassificationDTO[];
  //associatedAreas: CityAssociatedAreaDetailDTO[];
}
