import { MeasurementUnit } from '../measurement-unit/measurement-unit';
import { ProductType } from './product-type';

export interface GoodType {
  categoryTypeID: string;
  categoryType: Partial<ProductType>;
  warrantyPeriod: number;
  warrantyPeriodMeasurementUnitID: string;
  warrantyPeriodMeasurementUnit: Partial<MeasurementUnit>;
}
