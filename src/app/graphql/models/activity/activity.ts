import { AssociationType } from '../core-object/association-type';
import { CategoryType } from '../core-object/category-type';
import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface ActivityClassification {
  activityClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  activityID: string;
  activity: Partial<Activity>;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface ActivityAssociation {
  activityAssociationID: string;
  associationTypeID: string;
  associationType: Partial<AssociationType>;
  subjectActivityID: string;
  subjectActivity: Partial<Activity>;
  associatedActivityID: string;
  associatedActivity: Partial<Activity>;
}

export interface ActivityStatus {
  activityStatusID: string;
  startDateTime: Date;
  endDateTime: Date;
  activityID: string;
  activity: Partial<Activity>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}

export interface Activity {
  activityID: string;
  code: string;
  name: string;
  description: string;
  asignmentDateTime: Date;
  pannedStartDateTime: Date;
  plannedEndDateTime: Date;
  actualStartDateTime: Date;
  actualEndDateTime: Date;
  mandatoryPictureIndicator: string;
  colorID: string;
  color: Partial<Color>;
  locationID: string;
  location: Partial<Location>;
  statuses: ActivityStatus[];
  classifications: ActivityClassification[];
  associations: ActivityAssociation[];
}
