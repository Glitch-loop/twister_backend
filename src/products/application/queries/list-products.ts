import { Inject, Injectable } from '@nestjs/common';

import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';
import { ProductDto } from '@/src/products/application/dtos/product.dto';
import { ProductPriceDto } from '@/src/products/application/dtos/product-price.dto';

@Injectable()
export class ListProductsQuery {
	constructor(
		@Inject(ProductRepository) private readonly productRepository: ProductRepository,
	) {}

	async execute(
		limit?: number,
		filter?: string,
		lastCreatedAt?: string,
		lastIdProduct?: string,
	): Promise<ProductDto[]> {
		let limitToUse = 101;

		if ((lastCreatedAt && !lastIdProduct) || (!lastCreatedAt && lastIdProduct)) {
			throw new Error('If consulting a page larger than 1, pagination metadata is required.');
		}

		if (limit !== undefined) {
			if (limit <= 0 || limit > 100) {
				throw new Error('Limit must be greater than 0 and less than or equal to 100.');
			}

			limitToUse = limit + 1;
		}

		const repository = this.productRepository as ProductRepository & {
			listProducts: (
				limit: number,
				lastCreatedAt?: string,
				lastIdProduct?: string,
				filter?: string,
			) => Promise<ProductEntity[]>;
		};

		const products: ProductEntity[] = await repository.listProducts(
			limitToUse,
			lastCreatedAt,
			lastIdProduct,
			filter,
		);

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
			product.barcode,
		);
	}

	private toProductPriceDto(price: ProductPriceObjectValue): ProductPriceDto {
		return new ProductPriceDto(
			price.id_product_price,
			price.price,
			price.created_at,
			price.id_client,
			price.id_location,
			price.id_route_day,
		);
	}
}
