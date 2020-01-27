import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface PartyClassification {
  partyClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  partyID: string;
  party: Partial<Party>;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface PartyStatus {
  partyStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  partyID: string;
  party: Partial<Party>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}

export interface Party {
  partyID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
  color: Partial<Color>;
  statuses: PartyStatus[];
  classifications: PartyClassification[];
}
