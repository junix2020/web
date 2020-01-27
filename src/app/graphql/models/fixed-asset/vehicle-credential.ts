import { StatusType } from '../core-object/status-type';
import { CredentialType } from './credential-type';
import { FixedAsset } from './fixed-asset';

export interface VehicleCredential {
  vehicleCredentialID: string;
  expirationDate: Date;
  tractorFixedAssetID: string;
  tractorFixedAsset: Partial<FixedAsset>;
  credentialTypeID: string;
  credentialType: CredentialType;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}
