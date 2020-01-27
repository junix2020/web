import { FixedAsset } from './fixed-asset';

export interface Tractor {
  fixedAssetID: string;
  fixedAsset: Partial<FixedAsset>;
  plateNumber: string;
  chassisNumber: string;
  engineNumber: string;
  axleQuantity: number;
}
