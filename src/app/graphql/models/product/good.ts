import { Product } from "./product";
import { ProductionLot } from "./production-lot";

export interface Good {
  productID: string;
  product: Partial<Product>;
  deliveryDateTime: Date;
  warrantyExpirationDateTime: Date;
  serialNumber: string;
  productionLotID: string;
  productionLot: Partial<ProductionLot>;
}
