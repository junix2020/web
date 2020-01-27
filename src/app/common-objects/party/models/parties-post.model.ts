export class Party {
  partyID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
}
export class Person {
  partyID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
}

export class Organization {
  partyID: string;
  officialName: string;
  creationDate: Date;
}

export class PartyStatus {
  partyStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  partyID: string;
  statusTypeID: string;
}

export class PartyClassification {
  partyClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  partyID: string;
  categoryTypeID: string;
}
