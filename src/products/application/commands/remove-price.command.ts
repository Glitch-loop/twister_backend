import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { ProductAggregate } from '@/src/products/core/aggregates/product.aggregate';
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '../../core/value-objects/product-price.object-value';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

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

    const productAggregate = new ProductAggregate(products[0]);

    const priceProductBase:ProductPriceObjectValue = productAggregate.getProductBasePrice();

    if(id_product_price === priceProductBase.id_product_price) {
      throw new BusinessRuleException('Base product price cannot be removed.')
    }

    /*
      Business rules enforced inside aggregate:
      - Product must be active
      - Price must exist on this product
    */
    productAggregate.removePrice(id_product_price);

    await this.productRepository.deleteProductPrice(id_product_price);
  }
}
