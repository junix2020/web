import { Color } from '../user-interface/color';
import { AssociationType } from './association-type';
import { StatusType } from './status-type';

export interface CategoryTypeAssociation {
  categoryTypeAssociationID: string;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  subjectCategoryTypeID: string;
  subjectCategoryType: Partial<CategoryType>;
  associatedCategoryTypeID: string;
  associatedCategoryType: Partial<CategoryType>;
}

export interface CategoryTypeStatus {
  categoryTypeStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}

export interface CategoryType {
  categoryTypeID: string;
  code: string;
  name: string;
  description: string;
  detailIndicator: string;
  mutuallyExclusiveIndicator: string;
  permanentRecordIndicator: string;
  colorID: string;
  color: Partial<Color>;
  associations: Partial<CategoryTypeAssociation>[];
  statuses: Partial<CategoryTypeStatus>[];
}
