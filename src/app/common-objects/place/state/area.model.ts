import { ID } from '@datorama/akita';
import { CategoryType } from '@web/graphql/models';
import { uuid } from '@web/util/uuid';

export interface Area {
  areaID: ID;
  areaType: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: boolean;
  colorID: string;
  status: string;
  areaClassifications?: AreaClassification[];
}

export interface AreaClassification {
  areaClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: boolean;
  categoryType: string;
}

export function createArea(params: Partial<Area>) {
  return {} as Area;
}

export function createClassification(
  categoryType: CategoryType,
  primaryTypeIndicator = false,
) {
  return {
    areaClassificationID: uuid(),
    startDateTime: new Date(),
    endDateTime: null,
    categoryType: categoryType.name,
    primaryTypeIndicator: primaryTypeIndicator,
  } as AreaClassification;
}
