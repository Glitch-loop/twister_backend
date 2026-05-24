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

    const aggregate = new ProductAggregate(products[0]);

    const newPrice = new ProductPriceObjectValue(
      this.integrityRepository.generateUUIDv4(),
      price,
      new Date(),
      id_client,
      id_location,
      id_route_day,
    );

    /*
      Business rules enforced inside aggregate:
      - Product must be active
      - Only one FK allowed
      - No duplicate price per entity
    */
    aggregate.addPrice(newPrice);

    await this.productRepository.createProductPrice(id_product, newPrice);
  }
}
