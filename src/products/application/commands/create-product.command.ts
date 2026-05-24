import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { ProductAggregate } from '@/src/products/core/aggregates/product.aggregate';
import { ProductEntity } from '@/src/products/core/entities/product.entity';

@Injectable()
export class CreateProductCommand {
  constructor(
    @Inject(ProductRepository) private readonly productRepository: ProductRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) {}

  async execute(
    product_name: string,
    cost: number,
    quantity_presentation: number,
    order_to_show: number,
    id_measurement_unit: string,
    base_price: number,
    barcode?: string,
  ): Promise<void> {
    const aggregate = new ProductAggregate(null);

    const newProduct: ProductEntity = aggregate.createProduct(
      this.integrityRepository.generateUUIDv4(),
      product_name,
      cost,
      quantity_presentation,
      order_to_show,
      id_measurement_unit,
      this.integrityRepository.generateUUIDv4(),
      base_price,
      barcode,
    );

    await this.productRepository.createProduct(newProduct);
  }
}
