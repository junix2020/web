import { FixedAsset } from '../fixed-asset/fixed-asset';
import { Product } from './product';

export interface Service {
  productID: string;
  product: Partial<Product>;
  plannedStartDateTime: Date;
  plannedEndDateTime: Date;
  actualStartDateTime: Date;
  actualEndDateTime: Date;
  containerFixedAssetID: string;
  containerFixedAsset: Partial<FixedAsset>;
}
