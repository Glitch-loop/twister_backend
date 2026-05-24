import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { ProductAggregate } from '@/src/products/core/aggregates/product.aggregate';
import { ProductEntity } from '@/src/products/core/entities/product.entity';

@Injectable()
export class RemovePriceCommand {
  constructor(
    @Inject(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async execute(id_product: string, id_product_price: string): Promise<void> {
    const products: ProductEntity[] = await this.productRepository.retrieveProducts([id_product]);

    if (products.length === 0) {
      throw new Error(`Product with id ${id_product} does not exist.`);
    }

    const aggregate = new ProductAggregate(products[0]);

    /*
      Business rules enforced inside aggregate:
      - Product must be active
      - Price must exist on this product
    */
    aggregate.removePrice(id_product_price);

    await this.productRepository.deleteProductPrice(id_product_price);
  }
}
