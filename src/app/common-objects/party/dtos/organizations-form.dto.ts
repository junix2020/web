import { PartiesClassificationDTO } from './parties-classification.dto';

export class OrganizationFormDTO {
  organizationCategoryTypeID: string;
  organizationCategoryTypeName: string;
  partyID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
  organizationPartyID: string;
  officialName: string;
  creationDate: Date;
  partyStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  partyStatusPartyID: string;
  statusTypeID: string;
  statusName: string;
  classifications: PartiesClassificationDTO[];
}
