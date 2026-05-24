// Libraries
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

// Commands
import { CreateProductCommand } from '@/src/products/application/commands/create-product.command';
import { UpdateProductCommand } from '@/src/products/application/commands/update-product.command';
import { DeactivateProductCommand } from '@/src/products/application/commands/deactivate-product.command';
import { CreatePriceCommand } from '@/src/products/application/commands/create-price.command';
import { RemovePriceCommand } from '@/src/products/application/commands/remove-price.command';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductCommand: CreateProductCommand,
    private readonly updateProductCommand: UpdateProductCommand,
    private readonly deactivateProductCommand: DeactivateProductCommand,
    private readonly createPriceCommand: CreatePriceCommand,
    private readonly removePriceCommand: RemovePriceCommand,
  ) {}

  @Post()
  async createProduct(
    @Body()
    body: {
      product_name: string;
      cost: number;
      quantity_presentation: number;
      order_to_show: number;
      id_measurement_unit: string;
      base_price: number;
      barcode?: string;
    },
  ) {
    await this.createProductCommand.execute(
      body.product_name,
      body.cost,
      body.quantity_presentation,
      body.order_to_show,
      body.id_measurement_unit,
      body.base_price,
      body.barcode,
    );
    return { message: 'Product created successfully' };
  }

  @Patch('/:id_product')
  async updateProduct(
    @Param('id_product') id_product: string,
    @Body()
    body: {
      product_name?: string;
      cost?: number;
      quantity_presentation?: number;
      order_to_show?: number;
      id_measurement_unit?: string;
      barcode?: string;
    },
  ) {
    await this.updateProductCommand.execute(
      id_product,
      body.product_name,
      body.cost,
      body.quantity_presentation,
      body.order_to_show,
      body.id_measurement_unit,
      body.barcode,
    );
    return { message: 'Product updated successfully' };
  }

  @Patch('/:id_product/deactivate')
  async deactivateProduct(@Param('id_product') id_product: string) {
    await this.deactivateProductCommand.execute(id_product);
    return { message: 'Product deactivated successfully' };
  }

  @Post('/:id_product/prices')
  async createPrice(
    @Param('id_product') id_product: string,
    @Body()
    body: {
      price: number;
      id_client?: string;
      id_location?: string;
      id_route_day?: string;
    },
  ) {
    await this.createPriceCommand.execute(
      id_product,
      body.price,
      body.id_client,
      body.id_location,
      body.id_route_day,
    );
    return { message: 'Product price created successfully' };
  }

  @Delete('/:id_product/prices/:id_product_price')
  async removePrice(
    @Param('id_product') id_product: string,
    @Param('id_product_price') id_product_price: string,
  ) {
    await this.removePriceCommand.execute(id_product, id_product_price);
    return { message: 'Product price removed successfully' };
  }
}

