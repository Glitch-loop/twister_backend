import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

export class ProductAggregate {
  private _product: ProductEntity | null = null;
  private _prices: ProductPriceObjectValue[] = [];

  constructor(product: ProductEntity | null) {
    if (product) {
      this._prices = [...product.product_price];
      this._product = new ProductEntity(
        product.id_product,
        product.product_name,
        product.cost,
        product.product_status,
        product.quantity_presentation,
        product.order_to_show,
        product.id_measurement_unit,
        [...this._prices],
        product.created_at,
        product.barcode,
      );
    }
  }

  // ==================== Business rule assertions ====================
  /** A price may only carry one foreign key besides id_product. */
  private assertSingleForeignKey(price: ProductPriceObjectValue): void {
    const fkCount = [price.id_facility, price.id_location, price.id_route_day].filter(Boolean).length;
    if (fkCount > 1) {
      throw new BusinessRuleException(
        'A price may only have one foreign key (id_facility, id_location, or id_route_day).',
      ); 
    }
  }

  /** Only one price per entity (client / location / route-day). Base price is also unique. */
  private assertNoDuplicateEntity(price: ProductPriceObjectValue): void {
    const isBase = price.id_facility && price.id_location && price.id_route_day;

    const duplicate = this._prices.find((p) => {
      if (isBase) {
        return p.id_facility && p.id_location && p.id_route_day;
      }
      if (price.id_facility && p.id_facility === price.id_facility) return true;
      if (price.id_location && p.id_location === price.id_location) return true;
      if (price.id_route_day && p.id_route_day === price.id_route_day) return true;
      return false;
    });

    if (duplicate) {
      throw new BusinessRuleException(
        'A price for this entity already exists. Only one price per entity is allowed.',
      );
    }
  }

  /** Price must be non-negative. */
  private assertPriceNonNegative(price: ProductPriceObjectValue): void {
    if (price.price < 0) {
      throw new BusinessRuleException('Price must be greater than or equal to 0.');
    }
  }

  // ==================== Public operations ====================

  createProduct(
    id_product: string,
    product_name: string,
    cost: number,
    quantity_presentation: number,
    order_to_show: number,
    id_measurement_unit: string,
    base_price_id: string,
    base_price: number,
    barcode?: string,
  ): ProductEntity {
    const basePrice = new ProductPriceObjectValue(base_price_id, base_price, new Date());
    this._prices = [basePrice];
    this._product = new ProductEntity(
      id_product,
      product_name,
      cost,
      PRODUCT_STATUS_ENUM.ACTIVE,
      quantity_presentation,
      order_to_show,
      id_measurement_unit,
      this._prices,
      new Date(),
      barcode,
    );

    return this._product;
  }

  updateProduct(
    product_name?: string,
    cost?: number,
    quantity_presentation?: number,
    order_to_show?: number,
    id_measurement_unit?: string,
    barcode?: string,
  ): ProductEntity {
    if (this._product === null) throw new BusinessRuleException('Product is not initialized.');
    if (this._product.product_status === PRODUCT_STATUS_ENUM.INACTIVE) 
      throw new BusinessRuleException(`Cannot perform this operation. Product "${this._product.id_product}" is inactive.`);
    
    this._product = new ProductEntity(
      this._product.id_product,
      product_name ?? this._product.product_name,
      cost ?? this._product.cost,
      this._product.product_status,
      quantity_presentation ?? this._product.quantity_presentation,
      order_to_show ?? this._product.order_to_show,
      id_measurement_unit ?? this._product.id_measurement_unit,
      [...this._prices],
      this._product.created_at,
      barcode == undefined ? barcode : this._product.barcode,
    );

    return this._product;
  }

  deactivateProduct(): ProductEntity {
    if (this._product === null) throw new BusinessRuleException('Product is not initialized.');
    if (this._product.product_status === PRODUCT_STATUS_ENUM.INACTIVE) 
      throw new BusinessRuleException(`Cannot perform this operation. Product "${this._product.id_product}" is inactive.`);
    this._product = new ProductEntity(
      this._product.id_product,
      this._product.product_name,
      this._product.cost,
      PRODUCT_STATUS_ENUM.INACTIVE,
      this._product.quantity_presentation,
      this._product.order_to_show,
      this._product.id_measurement_unit,
      [...this._prices],
      this._product.created_at,
      this._product.barcode,
    );
    return this._product;
  }

  reactivateProduct(): ProductEntity {
    if (this._product === null) throw new BusinessRuleException('Product is not initialized.');
    this._product = new ProductEntity(
      this._product.id_product,
      this._product.product_name,
      this._product.cost,
      PRODUCT_STATUS_ENUM.ACTIVE,
      this._product.quantity_presentation,
      this._product.order_to_show,
      this._product.id_measurement_unit,
      [...this._prices],
      this._product.created_at,
      this._product.barcode,
    );
    return this._product;
  }

  addPrice(price: ProductPriceObjectValue): ProductPriceObjectValue {
    if (this._product === null) throw new BusinessRuleException('Product is not initialized.');
    if (this._product.product_status === PRODUCT_STATUS_ENUM.INACTIVE) 
      throw new BusinessRuleException(`Cannot perform this operation. Product "${this._product.id_product}" is inactive.`);
    this.assertPriceNonNegative(price);
    this.assertSingleForeignKey(price);
    this.assertNoDuplicateEntity(price);

    if(price.id_facility !== undefined) throw new BusinessRuleException('Id facility module is not implemented yet.');

    this._prices.push(price);
    return price;
  }

  removePrice(id_product_price: string): ProductPriceObjectValue {
    if (this._product === null) throw new BusinessRuleException('Product is not initialized.');
    
    // Business rule: Product must be actice.
    if (this._product.product_status === PRODUCT_STATUS_ENUM.INACTIVE) 
      throw new BusinessRuleException(`Cannot perform this operation. Product "${this._product.id_product}" is inactive.`);
    const index = this._prices.findIndex((p) => p.id_product_price === id_product_price);
    
    // Data integrity: Price to remove must belong to this product.
    if (index === -1) {
      throw new BusinessRuleException(
        `Price with id "${id_product_price}" does not exist on this product.`,
      );
    }
    const [removed] = this._prices.splice(index, 1);
    return removed;
  }

  getProduct(): ProductEntity {
    if (this._product === null) throw new BusinessRuleException('Product is not initialized.');

    return new ProductEntity(
      this._product.id_product,
      this._product.product_name,
      this._product.cost,
      this._product.product_status,
      this._product.quantity_presentation,
      this._product.order_to_show,
      this._product.id_measurement_unit,
      [...this._prices],
      this._product.created_at,
      this._product.barcode,
    );
  }

  getProductBasePrice(): ProductPriceObjectValue {
    const basePrice = this._prices.find(
      (price) =>
        price.id_facility === null &&
        price.id_location === null &&
        price.id_route_day === null
    );

    if (basePrice === undefined) {
      throw new BusinessRuleException('Base price is not defined for this product.');
    }

    return basePrice;
  }
}
