import { FixedAsset } from './fixed-asset';

export interface Chassis {
  fixedAssetID: string;
  fixedAsset: Partial<FixedAsset>;
  plateNumber: string;
  chassisNumber: string;
  axleQuantity: number;
}
