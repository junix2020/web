import { Party } from './party';

export interface Person {
  partyID: string;
  party: Partial<Party>;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
}
