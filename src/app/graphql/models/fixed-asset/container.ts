import { FixedAsset } from './fixed-asset';

export interface Container {
  fixedAssetID: string;
  fixedAsset: Partial<FixedAsset>;
  containerCode: string;
}
