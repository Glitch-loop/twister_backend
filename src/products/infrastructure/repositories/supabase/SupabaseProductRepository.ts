// Libraries
import { Injectable } from '@nestjs/common';

// Interfaces
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';

// Entities / Value Objects
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';

// Models
import { ProductModel } from '@/src/products/application/models/product.model';
import { ProductPriceModel } from '@/src/products/application/models/product-price.model';

// Mappers
import { Mapper } from '@/src/products/application/mappers/entity-model.mapper';

// Datasources
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

@Injectable()
export class SupabaseProductRepository implements ProductRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: Mapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createProduct(productEntity: ProductEntity): Promise<void> {
    try {
      const productModel = this.mapper.toModel(productEntity);

      const { error } = await this.supabase.from('products').insert(productModel);
      if (error) throw new Error(`Failed to insert product: ${error.message}`);

      if (productEntity.product_price.length > 0) {
        const priceModels = productEntity.product_price.map((p) =>
          this.mapper.toModel(p, productEntity.id_product),
        );

        const { error: priceError } = await this.supabase
          .from('product_prices')
          .insert(priceModels);
        if (priceError) throw new Error(`Failed to insert product prices: ${priceError.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to create product: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updateProduct(productEntity: ProductEntity): Promise<void> {
    try {
      const model = this.mapper.toModel(productEntity);

      const { error } = await this.supabase
        .from('products')
        .update({
          product_name: model.product_name,
          barcode: model.barcode,
          cost: model.cost,
          product_status: model.product_status,
          quantity_presentation: model.quantity_presentation,
          order_to_show: model.order_to_show,
          id_measurement_unit: model.id_measurement_unit,
        })
        .eq('id_product', model.id_product);

      if (error) throw new Error(`Failed to update product: ${error.message}`);
    } catch (error) {
      throw new Error(
        `Failed to update product: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listProducts(
    limit: number,
    lastCreatedAt?: string,
    lastIdProduct?: string,
    filter?: string,
  ): Promise<ProductEntity[]> {
    try {
      let query = this.supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })
        .order('id_product', { ascending: true })
        .limit(limit);

      if (lastCreatedAt) {
        query = query.gt('created_at', lastCreatedAt);
      }

      if (lastIdProduct) {
        query = query.neq('id_product', lastIdProduct);
      }

      if (filter) {
        query = query.or(`product_name.ilike.%${filter}%,barcode.ilike.%${filter}%`);
      }

      const { data: products, error } = await query;
      if (error) throw new Error(`Failed to list products: ${error.message}`);

      const productModels = (products ?? []) as ProductModel[];
      if (productModels.length === 0) return [];

      const ids = productModels.map((p) => p.id_product);
      const { data: prices, error: pricesError } = await this.supabase
        .from('product_prices')
        .select('*')
        .in('id_product', ids);
      if (pricesError) throw new Error(`Failed to list product prices: ${pricesError.message}`);

      const pricesByProduct = this.groupPricesByProduct((prices ?? []) as ProductPriceModel[]);

      return productModels.map((p) =>
        this.mapper.toDomainObject(p, pricesByProduct.get(p.id_product) ?? []),
      );
    } catch (error) {
      throw new Error(
        `Failed to list products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveProducts(idProduct: string[]): Promise<ProductEntity[]> {
    if (idProduct.length === 0) return [];

    try {
      const { data: products, error } = await this.supabase
        .from('products')
        .select('*')
        .in('id_product', idProduct);
      if (error) throw new Error(`Failed to retrieve products: ${error.message}`);

      const productModels = (products ?? []) as ProductModel[];
      if (productModels.length === 0) return [];

      const { data: prices, error: pricesError } = await this.supabase
        .from('product_prices')
        .select('*')
        .in('id_product', idProduct);
      if (pricesError) throw new Error(`Failed to retrieve product prices: ${pricesError.message}`);

      const pricesByProduct = this.groupPricesByProduct((prices ?? []) as ProductPriceModel[]);

      return productModels.map((p) =>
        this.mapper.toDomainObject(p, pricesByProduct.get(p.id_product) ?? []),
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createProductPrice(id_product: string, productPrice: ProductPriceObjectValue): Promise<void> {
    try {
      const priceModel = this.mapper.toModel(productPrice, id_product);

      const { error } = await this.supabase.from('product_prices').insert(priceModel);
      if (error) throw new Error(`Failed to create product price: ${error.message}`);
    } catch (error) {
      throw new Error(
        `Failed to create product price: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteProductPrice(id_product_price: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('product_prices')
        .delete()
        .eq('id_product_price', id_product_price);
      if (error) throw new Error(`Failed to delete product price: ${error.message}`);
    } catch (error) {
      throw new Error(
        `Failed to delete product price: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveBasePriceProducts(idProduct: string[]): Promise<ProductEntity[]> {
    if (idProduct.length === 0) return [];

    try {
      const { data: products, error } = await this.supabase
        .from('products')
        .select('*')
        .in('id_product', idProduct);
      if (error) throw new Error(`Failed to retrieve products: ${error.message}`);

      const productModels = (products ?? []) as ProductModel[];
      if (productModels.length === 0) return [];

      const { data: prices, error: pricesError } = await this.supabase
        .from('product_prices')
        .select('*')
        .in('id_product', idProduct)
        .is('id_client', null)
        .is('id_location', null)
        .is('id_route_day', null);
      if (pricesError) throw new Error(`Failed to retrieve base prices: ${pricesError.message}`);

      const pricesByProduct = this.groupPricesByProduct((prices ?? []) as ProductPriceModel[]);

      return productModels.map((p) =>
        this.mapper.toDomainObject(p, pricesByProduct.get(p.id_product) ?? []),
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve base price products: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrievePriceProductsByClient(idClient: string[]): Promise<ProductEntity[]> {
    return this.retrieveProductsWithPricesByFk('id_client', idClient);
  }

  async retrievePriceProductsByIdFacility(idFacility: string[]): Promise<ProductEntity[]> {
    return this.retrieveProductsWithPricesByFk('id_location', idFacility);
  }

  async retrievePriceProductsByIdRouteDay(idRouteDay: string[]): Promise<ProductEntity[]> {
    return this.retrieveProductsWithPricesByFk('id_route_day', idRouteDay);
  }

  // ==================== private helpers ====================

  private async retrieveProductsWithPricesByFk(
    fk: string,
    ids: string[],
  ): Promise<ProductEntity[]> {
    if (ids.length === 0) return [];

    try {
      const { data: prices, error: pricesError } = await this.supabase
        .from('product_prices')
        .select('*')
        .in(fk, ids);
      if (pricesError) throw new Error(`Failed to retrieve prices by ${fk}: ${pricesError.message}`);

      const priceModels = (prices ?? []) as ProductPriceModel[];
      if (priceModels.length === 0) return [];

      const productIds = [...new Set(priceModels.map((p) => p.id_product))];

      const { data: products, error } = await this.supabase
        .from('products')
        .select('*')
        .in('id_product', productIds);
      if (error) throw new Error(`Failed to retrieve products: ${error.message}`);

      const pricesByProduct = this.groupPricesByProduct(priceModels);

      return ((products ?? []) as ProductModel[]).map((p) =>
        this.mapper.toDomainObject(p, pricesByProduct.get(p.id_product) ?? []),
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve products with prices by ${fk}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private groupPricesByProduct(prices: ProductPriceModel[]): Map<string, ProductPriceModel[]> {
    const map = new Map<string, ProductPriceModel[]>();
    for (const price of prices) {
      const list = map.get(price.id_product) ?? [];
      list.push(price);
      map.set(price.id_product, list);
    }
    return map;
  }
}
