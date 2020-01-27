import { Party } from './party';

export interface Organization {
  partyID: string;
  party: Partial<Party>;
  officialName: string;
  creationDate: Date;
}
