import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { ProductAggregate } from '@/src/products/core/aggregates/product.aggregate';
import { ProductEntity } from '@/src/products/core/entities/product.entity';

@Injectable()
export class DeactivateProductCommand {
  constructor(
    @Inject(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async execute(id_product: string): Promise<void> {
    const products: ProductEntity[] = await this.productRepository.retrieveProducts([id_product]);

    if (products.length === 0) {
      throw new Error(`Product with id ${id_product} does not exist.`);
    }

    const aggregate = new ProductAggregate(products[0]);
    const deactivatedProduct = aggregate.deactivateProduct();

    await this.productRepository.updateProduct(deactivatedProduct);
  }
}
