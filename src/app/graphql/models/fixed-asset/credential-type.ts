import { StatusType } from '../core-object/status-type';
import { Party } from '../party/party';

export interface CredentialType {
  credentialTypeID: string;
  code: string;
  name: string;
  description: string;
  grantingPartyID: string;
  grantingParty: Partial<Party>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}
