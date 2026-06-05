// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';

// Repositories
import { SupabaseProductRepository } from '@/src/products/infrastructure/repositories/supabase/SupabaseProductRepository';

// Datasources
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Mappers
import { Mapper } from '@/src/products/application/mappers/entity-model.mapper';

// Commands
import { CreateProductCommand } from '@/src/products/application/commands/create-product.command';
import { UpdateProductCommand } from '@/src/products/application/commands/update-product.command';
import { DeactivateProductCommand } from '@/src/products/application/commands/deactivate-product.command';
import { ReactivateProductCommand } from '@/src/products/application/commands/reactivate-product.command';
import { CreatePriceCommand } from '@/src/products/application/commands/create-price.command';
import { RemovePriceCommand } from '@/src/products/application/commands/remove-price.command';

// Queries
import { ListProductsQuery } from '@/src/products/application/queries/list-products';
import { RetrieveProductByIdProductQuery } from '@/src/products/application/queries/retrieve-product-by-id-product';

// Controllers
import { ProductsController } from '@/src/products/products.controller';

// Modules
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ProductsController],
  providers: [
    CreateProductCommand,
    UpdateProductCommand,
    DeactivateProductCommand,
    ReactivateProductCommand,
    CreatePriceCommand,
    RemovePriceCommand,
    ListProductsQuery,
    RetrieveProductByIdProductQuery,
    Mapper,
    {
      provide: ProductRepository,
      useClass: SupabaseProductRepository,
    },
    SupabaseDataSource,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}

