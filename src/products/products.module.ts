// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { ProductsController } from '@/src/products/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
