import { StatusType } from './status-type';

export interface AssociationTypeAssociation {
  associationTypeAssociationID: string;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  subjectAssociationTypeID: string;
  subjectAssociationType: Partial<AssociationType>;
  relatedAssociationTypeID: string;
  relatedAssociationType: Partial<AssociationType>;
}

export interface AssociationType {
  associationTypeID: string;
  code: string;
  name: string;
  description: string;
  colorID: string;
  detailIndicator: string;
  statusTypeID: string;
  statusType: Partial<StatusType>;
  associations: AssociationTypeAssociation[];
}
