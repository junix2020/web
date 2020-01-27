import { Color } from '../user-interface/color';
import { AssociationType } from './association-type';

export interface StatusTypeAssociation {
  statusTypeAssociationID: string;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  subjectStatusTypeID: string;
  subjectStatusType: Partial<StatusType>;
  associatedStatusTypeID: string;
  associatedStatusType: Partial<StatusType>;
}

export interface StatusType {
  statusTypeID: string;
  code: string;
  name: string;
  description: string;
  detailIndicator: string;
  colorID: string;
  color: Partial<Color>;
  associations: StatusTypeAssociation[];
}
