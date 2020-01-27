import { CategoryType } from '../core-object/category-type';
import { Color } from '../user-interface/color';

export class ProductClassification {
  productClassificationID: string;
  startDateTime: Date;
  endDateTime: Date;
  primaryTypeIndicator: string;
  productID: string;
  product: Partial<Product>;
  categoryType: Partial<CategoryType>;
}

export class Product {
  productID: string;
  code: string;
  name: string;
  description: string;
  permanentRecordIndicator: string;
  colorID: string;
  color: Partial<Color>;
  classifications: Array<Partial<ProductClassification>>;
}
