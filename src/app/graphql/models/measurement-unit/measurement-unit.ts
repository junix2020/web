import { StatusType } from '../core-object/status-type';
import { Color } from '../user-interface/color';

export interface MeasurementUnit {
  measurementUnitID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
  color: Partial<Color>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}
