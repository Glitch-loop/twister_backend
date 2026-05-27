// Libraries
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

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

// DTOs
import { CreateProductRequestDto } from '@/src/products/application/dtos/create-product-request.dto';
import { UpdateProductRequestDto } from '@/src/products/application/dtos/update-product-request.dto';
import { CreateProductPriceRequestDto } from '@/src/products/application/dtos/create-product-price-request.dto';
import { RetrieveProductsByIdRequestDto } from '@/src/products/application/dtos/retrieve-products-by-id-request.dto';
import { ProductDto } from '@/src/products/application/dtos/product.dto';

// Presentation
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductCommand: CreateProductCommand,
    private readonly updateProductCommand: UpdateProductCommand,
    private readonly deactivateProductCommand: DeactivateProductCommand,
    private readonly reactivateProductCommand: ReactivateProductCommand,
    private readonly createPriceCommand: CreatePriceCommand,
    private readonly removePriceCommand: RemovePriceCommand,
    private readonly listProductsQuery: ListProductsQuery,
    private readonly retrieveProductByIdProductQuery: RetrieveProductByIdProductQuery,
  ) {}

  @ApiOperation({
    summary: 'Create product',
    description: 'Creates a new product with base price information.',
  })
  @ApiBody({ type: CreateProductRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post()
  async createProduct(@Body() body: CreateProductRequestDto): Promise<httpControllerResponse> {
    await this.createProductCommand.execute(
      body.product_name,
      body.cost,
      body.quantity_presentation,
      body.order_to_show,
      body.id_measurement_unit,
      body.base_price,
      body.barcode,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product created successfully');
  }

  @ApiOperation({
    summary: 'List products',
    description: 'Returns a paginated list of products with optional text filter.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 100).' })
  @ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
  @ApiQuery({ name: 'filter', required: false, type: String, description: 'Filter by product name or barcode.' })
  @ApiOkResponse({ description: 'Standardized paginated response with products collection.', type: [ProductDto] })
  @Get()
  async listProducts(
    @Query('limit') limit?: string,
    @Query('filter') filter?: string,
    @Query('next_item') next_item?: string,
  ): Promise<httpControllerResponse> {
    let parsedLimit = 100;
    let next_id: string | undefined;
    let next_date: string | undefined;

    const httpRequestFormatter = new httpFormatter();
    const httpResponseFormatter = new httpFormatter();

    if (next_item) {
      const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
      next_id = paginationInformation.id;
      if (paginationInformation.created_at) {
        next_date = paginationInformation.created_at;
      }
    }

    if (limit) {
      parsedLimit = Number.parseInt(limit, 10);
    }

    const products = await this.listProductsQuery.execute(
      parsedLimit,
      filter,
      next_date,
      next_id,
    );

    return httpResponseFormatter.createResponse(
      'Products listed successfully.',
      products,
      parsedLimit,
      'id_product',
      'id_product',
    );
  }

  @ApiOperation({
    summary: 'Retrieve products by ids',
    description: 'Retrieves specific products by ids. Limit is 100 and there is no pagination.',
  })
  @ApiBody({ type: RetrieveProductsByIdRequestDto })
  @ApiOkResponse({ description: 'Standardized response with retrieved products.', type: [ProductDto] })
  @Post('/ids')
  async retrieveProductsById(
    @Body() body: RetrieveProductsByIdRequestDto,
  ): Promise<httpControllerResponse> {
    const products = await this.retrieveProductByIdProductQuery.execute(body.id_product ?? []);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Products retrieved successfully.', products);
  }

  @ApiOperation({
    summary: 'Update product',
    description: 'Updates product information by product identifier.',
  })
  @ApiParam({ name: 'id_product', description: 'Product identifier', type: String })
  @ApiBody({ type: UpdateProductRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_product')
  async updateProduct(
    @Param('id_product') id_product: string,
    @Body() body: UpdateProductRequestDto,
  ): Promise<httpControllerResponse> {
    await this.updateProductCommand.execute(
      id_product,
      body.product_name,
      body.cost,
      body.quantity_presentation,
      body.order_to_show,
      body.id_measurement_unit,
      body.barcode,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product updated successfully');
  }

  @ApiOperation({
    summary: 'Deactivate product',
    description: 'Deactivates a product by product identifier.',
  })
  @ApiParam({ name: 'id_product', description: 'Product identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_product/deactivate')
  async deactivateProduct(
    @Param('id_product') id_product: string,
  ): Promise<httpControllerResponse> {
    await this.deactivateProductCommand.execute(id_product);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product deactivated successfully');
  }

  @ApiOperation({
    summary: 'Reactivate product',
    description: 'Reactivates a product by product identifier.',
  })
  @ApiParam({ name: 'id_product', description: 'Product identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_product/reactivate')
  async reactivateProduct(
    @Param('id_product') id_product: string,
  ): Promise<httpControllerResponse> {
    await this.reactivateProductCommand.execute(id_product);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product reactivated successfully');
  }

  @ApiOperation({
    summary: 'Create product price',
    description: 'Creates a new price for the product, optionally scoped to client, location, or route day.',
  })
  @ApiParam({ name: 'id_product', description: 'Product identifier', type: String })
  @ApiBody({ type: CreateProductPriceRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/:id_product/prices')
  async createPrice(
    @Param('id_product') id_product: string,
    @Body() body: CreateProductPriceRequestDto,
  ): Promise<httpControllerResponse> {
    await this.createPriceCommand.execute(
      id_product,
      body.price,
      body.id_client,
      body.id_location,
      body.id_route_day,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product price created successfully');
  }

  @ApiOperation({
    summary: 'Remove product price',
    description: 'Removes a price record from the specified product.',
  })
  @ApiParam({ name: 'id_product', description: 'Product identifier', type: String })
  @ApiParam({ name: 'id_product_price', description: 'Product price identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Delete('/:id_product/prices/:id_product_price')
  async removePrice(
    @Param('id_product') id_product: string,
    @Param('id_product_price') id_product_price: string,
  ): Promise<httpControllerResponse> {
    await this.removePriceCommand.execute(id_product, id_product_price);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product price removed successfully');
  }
}

