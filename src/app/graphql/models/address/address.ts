import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface AddressClassification {
  addressClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  addressID: string;
  address: Address;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface Address {
  addressID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
  color: Partial<Color>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
  classifications: AddressClassification[];
}
