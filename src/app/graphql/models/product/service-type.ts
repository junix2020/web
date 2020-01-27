import { CategoryType } from '../core-object/category-type';
import { MeasurementUnit } from '../measurement-unit/measurement-unit';
import { Party } from '../party/party';
import { ProductType } from './product-type';

export interface ServiceType {
  categoryTypeID: string;
  categoryType: Partial<ProductType>;
  multipleCargoOwnerStopIndicator: string;
  waitingTimeDuration: number;
  measurementUnitID: string;
  measurementUnit: Partial<MeasurementUnit>;
  routeCategoryTypeID: string;
  routeCategoryType: Partial<CategoryType>;
  cargoOwnerPartyID: string;
  cargoOwnerParty: Partial<Party>;
}
