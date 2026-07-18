import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { ProductAggregate } from '@/src/products/core/aggregates/product.aggregate';
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';

@Injectable()
export class CreatePriceCommand {
  constructor(
    @Inject(ProductRepository) private readonly productRepository: ProductRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) {}

  async execute(
    id_product: string,
    price: number,
    id_client?: string,
    id_location?: string,
    id_route_day?: string,
  ): Promise<void> {
    const products: ProductEntity[] = await this.productRepository.retrieveProducts([id_product]);

    if (products.length === 0) {
      throw new Error(`Product with id ${id_product} does not exist.`);
    }
    
    const newPrice = new ProductPriceObjectValue(
      this.integrityRepository.generateUUIDv4(),
      price,
      new Date(),
      id_client === undefined ? null : id_client,
      id_location === undefined ? null : id_location,
      id_route_day === undefined ? null : id_route_day,
    );

    const productAggregate = new ProductAggregate(products[0]);

    if(id_client === undefined && id_location === undefined && id_route_day === undefined) { 
      // User is trying to add a new base price to the product.
      const basePrice:ProductPriceObjectValue|undefined = productAggregate.getProductBasePrice();

      if(basePrice) {
        const { id_product_price } = basePrice;

        const productBasePriceToRemove:ProductPriceObjectValue = productAggregate.removePrice(id_product_price);

        await this.productRepository.deleteProductPrice(productBasePriceToRemove.id_product_price);
      }
    } else {
      // User is trying to add a price for a particular entity
    }

    /*
      Business rules enforced inside aggregate:
      - Product must be active
      - Only one FK allowed
      - No duplicate price per entity
    */
    productAggregate.addPrice(newPrice);

    await this.productRepository.createProductPrice(id_product, newPrice);
  }
}
