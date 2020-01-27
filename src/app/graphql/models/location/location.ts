import { Address } from '../address/address';
import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface LocationClassification {
  locationClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  locationID: string;
  location: Partial<Location>;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface Location {
  locationID: string;
  code: string;
  name: string;
  description: string;
  mandatoryAppointmentIndicator: string;
  colorID: string;
  color: Partial<Color>;
  addressID: string;
  address: Address;
  statusTypeID: string;
  statusType: Partial<StatusType>;
  classifications: LocationClassification[];
}
