import { CategoryType } from '../core-object/category-type';
import { MeasurementUnit } from '../measurement-unit/measurement-unit';

export interface ActivityTypeClassification {
  activityTypeClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  activityTypeCategoryTypeID: string;
  activityTypeCategoryType?: Partial<CategoryType>;
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
}

export interface ActivityType {
  categoryTypeID: string;
  categoryType: Partial<CategoryType>;
  mandatoryPictureIndicator: string;
  standardDuration: string;
  measurementUnitID: string;
  measurementUnit: MeasurementUnit;
  classifications: ActivityTypeClassification[];
}
