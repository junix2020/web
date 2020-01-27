import { Color } from '../user-interface/color';
import { StatusType } from './status-type';

export interface RoleType {
  roleTypeID: string;
  code: string;
  name: string;
  description: string;
  detailIndicator: string;
  colorID: string;
  color: Partial<Color>;
  statusTypeID: string;
  statusType: Partial<StatusType>;
}
