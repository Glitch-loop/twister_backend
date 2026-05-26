import { ProductEntity } from "../entities/product.entity";
import { ProductPriceObjectValue } from "../value-objects/product-price.object-value";


export abstract class ProductRepository {
  abstract createProduct(productEntity: ProductEntity): Promise<void>;
  abstract updateProduct(productEntity: ProductEntity): Promise<void>;
  abstract listProducts(
    limit: number,
    lastCreatedAt?: string,
    lastIdProduct?: string,
    filter?: string,
  ): Promise<ProductEntity[]>;
  abstract retrieveProducts(idProduct: string[]): Promise<ProductEntity[]>;
  abstract createProductPrice(id_product: string, productPrice: ProductPriceObjectValue): Promise<void>;
  abstract deleteProductPrice(id_product_price: string): Promise<void>;
  abstract retrieveBasePriceProducts(idProduct: string[]): Promise<ProductEntity[]>; // All the other foreign keys are null.
  abstract retrievePriceProductsByClient(idClient: string[]): Promise<ProductEntity[]>;
  abstract retrievePriceProductsByIdFacility(idFacility: string[]): Promise<ProductEntity[]>;
  abstract retrievePriceProductsByIdRouteDay(idRouteDay: string[]): Promise<ProductEntity[]>;
}