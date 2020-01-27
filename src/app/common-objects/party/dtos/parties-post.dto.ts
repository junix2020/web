import { Party, Person, PartyStatus, PartyClassification, Organization } from '../models/parties-post.model';

export class PartiesPostDTO {
  party: Party;
  person: Person;
  organization: Organization;
  partyStatus: PartyStatus;
  partyClassifications: PartyClassification[];
}
