import { AssociationType } from '../core-object/association-type';
import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { MeasurementUnit } from '../measurement-unit/measurement-unit';

export interface ProductTypeAssociation {
  productTypeAssociationID: string;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  productTypeCategoryTypeID: string;
  productTypeCategoryType: Partial<CategoryType>;
  associatedProductTypeCategoryTypeID: string;
  associatedProductTypeCategoryTypeI: Partial<CategoryType>;
}

export interface ProductTypeClassification {
  productTypeClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  productTypeCategoryTypeID: string;
  productTypeCategoryType: Partial<CategoryType>;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface ProductTypeStatus {
  productTypeStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  productTypeCategoryTypeID: string;
  productTypeCategoryType: Partial<CategoryType>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}

export interface ProductType {
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
  introductionDate: Date;
  salesDiscontinuationDate: Date;
  supportDiscontinuationDate: Date;
  measurementUnitID: string;
  measurementUnit: Partial<MeasurementUnit>;
  statuses: Partial<ProductTypeStatus>[];
  classifications: Partial<ProductTypeClassification>[];
}
