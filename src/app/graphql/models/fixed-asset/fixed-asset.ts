import { AssociationType } from '../core-object/association-type';
import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface FixedAssetAssociation {
  fixedAssetAssociationID: string;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  fixedAssetID: string;
  fixedAsset: Partial<FixedAsset>;
  associatedFixedAssetID: string;
  associatedFixedAsset: Partial<FixedAsset>;
}

export interface FixedAssetStatus {
  fixedAssetStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  fixedAssetID: string;
  fixedAsset: Partial<FixedAsset>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}

export interface FixedAssetClassification {
  fixedAssetClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  fixedAssetID: string;
  fixedAsset: Partial<FixedAsset>;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface FixedAsset {
  fixedAssetID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  serialNumber: string;
  colorID: string;
  color: Partial<Color>;
  statuses: FixedAssetStatus[];
  classifications: FixedAssetClassification[];
  associations: FixedAssetAssociation[];
}
