import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';
import { ProductDto } from '@/src/products/application/dtos/product.dto';
import { ProductPriceDto } from '@/src/products/application/dtos/product-price.dto';

@Injectable()
export class RetrieveProductByIdProductQuery {
	constructor(
		@Inject(ProductRepository) private readonly productRepository: ProductRepository,
	) {}

	async execute(id_product: string[]): Promise<ProductDto[]> {
		if (id_product.length > 100) {
			throw new Error('Retrieve by id limit is 100.');
		}

		const products = await this.productRepository.retrieveProducts(id_product);
		return products.map((product) => this.toProductDto(product));
	}

	private toProductDto(product: ProductEntity): ProductDto {
		const prices = product.product_price.map((price) => this.toProductPriceDto(price));

		return new ProductDto(
			product.id_product,
			product.product_name,
			product.cost,
			product.product_status,
			product.quantity_presentation,
			product.order_to_show,
			product.id_measurement_unit,
			prices,
			product.barcode === null ? undefined : product.barcode,
		);
	}

	private toProductPriceDto(price: ProductPriceObjectValue): ProductPriceDto {
		return new ProductPriceDto(
			price.id_product_price,
			price.price,
			price.created_at,
			price.id_facility === null ? undefined : price.id_facility,
			price.id_location === null ? undefined : price.id_location,
			price.id_route_day === null ? undefined : price.id_route_day,
		);
	}
}
