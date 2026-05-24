import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { ProductAggregate } from '@/src/products/core/aggregates/product.aggregate';
import { ProductEntity } from '@/src/products/core/entities/product.entity';

@Injectable()
export class UpdateProductCommand {
  constructor(
    @Inject(ProductRepository) private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    id_product: string,
    product_name?: string,
    cost?: number,
    quantity_presentation?: number,
    order_to_show?: number,
    id_measurement_unit?: string,
    barcode?: string,
  ): Promise<void> {
    const products: ProductEntity[] = await this.productRepository.retrieveProducts([id_product]);

    if (products.length === 0) {
      throw new Error(`Product with id ${id_product} does not exist.`);
    }

    const aggregate = new ProductAggregate(products[0]);
    const updatedProduct = aggregate.updateProduct(
      product_name,
      cost,
      quantity_presentation,
      order_to_show,
      id_measurement_unit,
      barcode,
    );

    await this.productRepository.updateProduct(updatedProduct);
  }
}
