import { Injectable } from '@nestjs/common';

// Entities / Value Objects
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';

// Models
import { ProductModel } from '@/src/products/application/models/product.model';
import { ProductPriceModel } from '@/src/products/application/models/product-price.model';

// Guards
import { isProductModel } from '@/src/products/application/guards/models/product.guard';
import { isProductPriceModel } from '@/src/products/application/guards/models/product-price.guard';

@Injectable()
export class Mapper {
  // ==================== toModel overloads ====================

  toModel(entity: ProductEntity): ProductModel;
  toModel(entity: ProductPriceObjectValue, id_product: string): ProductPriceModel;
  toModel(
    entity: ProductEntity | ProductPriceObjectValue,
    id_product?: string,
  ): ProductModel | ProductPriceModel {
    if (entity instanceof ProductEntity) {
      return this.productEntityToModel(entity);
    }
    if (entity instanceof ProductPriceObjectValue) {
      if (!id_product) throw new Error('id_product is required when mapping ProductPriceObjectValue to model.');
      return this.productPriceToModel(entity, id_product);
    }
    throw new Error('Unknown entity type for toModel.');
  }

  // ==================== toDomainObject overloads ====================

  toDomainObject(model: ProductModel, prices: ProductPriceModel[]): ProductEntity;
  toDomainObject(model: ProductPriceModel): ProductPriceObjectValue;
  toDomainObject(
    model: ProductModel | ProductPriceModel,
    prices?: ProductPriceModel[],
  ): ProductEntity | ProductPriceObjectValue {
    console.log(model)
    if (isProductModel(model)) {
      return this.productModelToEntity(model, prices ?? []);
    }
    if (isProductPriceModel(model)) {
      return this.productPriceModelToObjectValue(model);
    }
    throw new Error('Unknown model type for toDomainObject.');
  }

  // ==================== private converters ====================

  private productEntityToModel(entity: ProductEntity): ProductModel {
    return {
      id_product: entity.id_product,
      product_name: entity.product_name,
      barcode: entity.barcode,
      cost: entity.cost,
      product_status: entity.product_status,
      quantity_presentation: entity.quantity_presentation,
      created_at: entity.created_at,
      order_to_show: entity.order_to_show,
      id_measurement_unit: entity.id_measurement_unit,
    };
  }

  private productPriceToModel(value: ProductPriceObjectValue, id_product: string): ProductPriceModel {
    return {
      id_product_price: value.id_product_price,
      price: value.price,
      created_at: value.created_at,
      id_product,
      id_facility: value.id_facility,
      id_location: value.id_location,
      id_route_day: value.id_route_day,
    };
  }

  private productModelToEntity(model: ProductModel, prices: ProductPriceModel[]): ProductEntity {
    const productPrices = prices.map((p) => this.productPriceModelToObjectValue(p));
    return new ProductEntity(
      model.id_product,
      model.product_name,
      model.cost,
      model.product_status,
      model.quantity_presentation,
      model.order_to_show,
      model.id_measurement_unit,
      productPrices,
      model.created_at,
      model.barcode,
    );
  }

  private productPriceModelToObjectValue(model: ProductPriceModel): ProductPriceObjectValue {
    return new ProductPriceObjectValue(
      model.id_product_price,
      model.price,
      model.created_at instanceof Date ? model.created_at : new Date(model.created_at),
      model.id_facility,
      model.id_location,
      model.id_route_day,
    );
  }
}
