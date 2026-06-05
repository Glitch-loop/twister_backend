import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CreateInventoryCommand } from '@/src/inventories/application/commands/create-inventory.command';
import { DeactiveInventoryCommand } from '@/src/inventories/application/commands/deactive-inventory.command';
import { RegisterInventoryAdjustmentCommand } from '@/src/inventories/application/commands/register-inventory-adjustment.command';
import { RegisterInventoryOperationForTransactionCommand } from '@/src/inventories/application/commands/register-inventory-operation-for-transaction.command';
import { RegisterInventoryOperatonBetweenInventoriesCommand } from '@/src/inventories/application/commands/register-inventory-operaton-between-inventories.command';
import { RegisterProductDevolutionCommand } from '@/src/inventories/application/commands/register-product-devolution.command';
import { RegisterSupplierReciptCommand } from '@/src/inventories/application/commands/register-supplier-recipt.command';
import { RegisterWasteInventoryOperationCommand } from '@/src/inventories/application/commands/register-waste-inventory-operation.command';
import { ReverseInventoryMovementCommand } from '@/src/inventories/application/commands/reverse-inventory-movement.command';
import { UpdateInventoryCommand } from '@/src/inventories/application/commands/update-inventory.command';
import { CreateInventoryRequestDto } from '@/src/inventories/application/dtos/create-inventory-request.dto';
import { InventoryDto } from '@/src/inventories/application/dtos/inventory.dto';
import { InventoryOperationDto } from '@/src/inventories/application/dtos/inventory-operation.dto';
import { RegisterInventoryAdjustmentRequestDto } from '@/src/inventories/application/dtos/register-inventory-adjustment-request.dto';
import { RegisterInventoryOperationBetweenInventoriesRequestDto } from '@/src/inventories/application/dtos/register-inventory-operation-between-inventories-request.dto';
import { RegisterInventoryOperationForTransactionRequestDto } from '@/src/inventories/application/dtos/register-inventory-operation-for-transaction-request.dto';
import { RegisterProductDevolutionRequestDto } from '@/src/inventories/application/dtos/register-product-devolution-request.dto';
import { RegisterSupplierReciptRequestDto } from '@/src/inventories/application/dtos/register-supplier-recipt-request.dto';
import { RegisterWasteInventoryOperationRequestDto } from '@/src/inventories/application/dtos/register-waste-inventory-operation-request.dto';
import { RetrieveInventoriesByIdRequestDto } from '@/src/inventories/application/dtos/retrieve-inventories-by-id-request.dto';
import { RetrieveInventoryOperationsByIdRequestDto } from '@/src/inventories/application/dtos/retrieve-inventory-operations-by-id-request.dto';
import { ReverseInventoryMovementRequestDto } from '@/src/inventories/application/dtos/reverse-inventory-movement-request.dto';
import { UpdateInventoryRequestDto } from '@/src/inventories/application/dtos/update-inventory-request.dto';
import { ListInventoriesQuery } from '@/src/inventories/application/queries/list-inventories.query';
import { ListInventoryOperationsQuery } from '@/src/inventories/application/queries/list-inventory-operations.query';
import { RetrieveInventoriesByIdInventoryQuery } from '@/src/inventories/application/queries/retrieve-inventories-by-id-inventory.query';
import { RetrieveInventoryOperationsByIdInventoryOperationQuery } from '@/src/inventories/application/queries/retrieve-inventory-operations-by-id-inventory-operation.query';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';

@ApiTags('Inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(
    private readonly createInventoryCommand: CreateInventoryCommand,
    private readonly updateInventoryCommand: UpdateInventoryCommand,
    private readonly deactiveInventoryCommand: DeactiveInventoryCommand,
    private readonly registerInventoryOperationForTransactionCommand: RegisterInventoryOperationForTransactionCommand,
    private readonly registerProductDevolutionCommand: RegisterProductDevolutionCommand,
    private readonly registerInventoryOperatonBetweenInventoriesCommand: RegisterInventoryOperatonBetweenInventoriesCommand,
    private readonly registerInventoryAdjustmentCommand: RegisterInventoryAdjustmentCommand,
    private readonly registerSupplierReciptCommand: RegisterSupplierReciptCommand,
    private readonly registerWasteInventoryOperationCommand: RegisterWasteInventoryOperationCommand,
    private readonly reverseInventoryMovementCommand: ReverseInventoryMovementCommand,
    private readonly listInventoriesQuery: ListInventoriesQuery,
    private readonly retrieveInventoriesByIdInventoryQuery: RetrieveInventoriesByIdInventoryQuery,
    private readonly listInventoryOperationsQuery: ListInventoryOperationsQuery,
    private readonly retrieveInventoryOperationsByIdInventoryOperationQuery: RetrieveInventoryOperationsByIdInventoryOperationQuery,
  ) {}

  @ApiOperation({
    summary: 'Create inventory',
    description: 'Creates an inventory and returns a standardized controller response.',
  })
  @ApiBody({ type: CreateInventoryRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('')
  async createInventory(@Body() body: CreateInventoryRequestDto): Promise<httpControllerResponse> {
    await this.createInventoryCommand.execute(
      body.inventory_context,
      body.inventory_name,
      body.created_by,
      body.assigned_to,
      body.assigned_facility,
      body.id_inventory,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory created successfully.');
  }

  @ApiOperation({
    summary: 'Update inventory',
    description: 'Updates inventory name and returns a standardized controller response.',
  })
  @ApiParam({ name: 'id_inventory', description: 'Inventory identifier', type: String })
  @ApiBody({ type: UpdateInventoryRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_inventory')
  async updateInventory(
    @Param('id_inventory') id_inventory: string,
    @Body() body: UpdateInventoryRequestDto,
  ): Promise<httpControllerResponse> {
    await this.updateInventoryCommand.execute(id_inventory, body.inventory_name);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory updated successfully.');
  }

  @ApiOperation({
    summary: 'Deactivate inventory',
    description: 'Deactivates an inventory and returns a standardized controller response.',
  })
  @ApiParam({ name: 'id_inventory', description: 'Inventory identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_inventory/deactivate')
  async deactiveInventory(@Param('id_inventory') id_inventory: string): Promise<httpControllerResponse> {
    await this.deactiveInventoryCommand.execute(id_inventory);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory deactivated successfully.');
  }

  @ApiOperation({
    summary: 'Register transaction inventory operation',
    description: 'Registers a SELLING or PRODUCT_REPOSITION inventory operation.',
  })
  @ApiBody({ type: RegisterInventoryOperationForTransactionRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/transaction')
  async registerInventoryOperationForTransaction(
    @Body() body: RegisterInventoryOperationForTransactionRequestDto,
  ): Promise<httpControllerResponse> {
    await this.registerInventoryOperationForTransactionCommand.execute(
      body.id_inventory_origin,
      body.movement_type,
      body.document_reference,
      body.created_by,
      body.inventory_operation_descriptions,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory operation for transaction registered successfully.');
  }

  @ApiOperation({
    summary: 'Register product devolution',
    description: 'Registers a PRODUCT_DEVOLUTION inventory operation.',
  })
  @ApiBody({ type: RegisterProductDevolutionRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/product-devolution')
  async registerProductDevolution(
    @Body() body: RegisterProductDevolutionRequestDto,
  ): Promise<httpControllerResponse> {
    await this.registerProductDevolutionCommand.execute(
      body.id_inventory_origin,
      body.created_by,
      body.inventory_operation_descriptions,
      body.document_reference,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Product devolution inventory operation registered successfully.');
  }

  @ApiOperation({
    summary: 'Register internal inventory operation',
    description: 'Registers an INTERNAL_MOVEMENT between two inventories.',
  })
  @ApiBody({ type: RegisterInventoryOperationBetweenInventoriesRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/internal')
  async registerInventoryOperationBetweenInventories(
    @Body() body: RegisterInventoryOperationBetweenInventoriesRequestDto,
  ): Promise<httpControllerResponse> {
    await this.registerInventoryOperatonBetweenInventoriesCommand.execute(
      body.id_inventory_origin,
      body.id_inventory_destination,
      body.created_by,
      body.inventory_operation_descriptions,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Internal inventory operation registered successfully.');
  }

  @ApiOperation({
    summary: 'Register inventory adjustment',
    description: 'Registers an ADJUSTMENT inventory operation.',
  })
  @ApiBody({ type: RegisterInventoryAdjustmentRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/adjustment')
  async registerInventoryAdjustment(
    @Body() body: RegisterInventoryAdjustmentRequestDto,
  ): Promise<httpControllerResponse> {
    await this.registerInventoryAdjustmentCommand.execute(
      body.id_inventory_origin,
      body.created_by,
      body.inventory_operation_descriptions,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory adjustment registered successfully.');
  }

  @ApiOperation({
    summary: 'Register supplier receipt',
    description: 'Registers a SUPPLIER_RECIPT inventory operation.',
  })
  @ApiBody({ type: RegisterSupplierReciptRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/supplier-receipt')
  async registerSupplierRecipt(
    @Body() body: RegisterSupplierReciptRequestDto,
  ): Promise<httpControllerResponse> {
    await this.registerSupplierReciptCommand.execute(
      body.id_inventory_destination,
      body.created_by,
      body.inventory_operation_descriptions,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Supplier receipt inventory operation registered successfully.');
  }

  @ApiOperation({
    summary: 'Register waste inventory operation',
    description: 'Registers an INVENTORY_SCRAP inventory operation.',
  })
  @ApiBody({ type: RegisterWasteInventoryOperationRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/waste')
  async registerWasteInventoryOperation(
    @Body() body: RegisterWasteInventoryOperationRequestDto,
  ): Promise<httpControllerResponse> {
    await this.registerWasteInventoryOperationCommand.execute(
      body.id_inventory_origin,
      body.created_by,
      body.inventory_operation_descriptions,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Waste inventory operation registered successfully.');
  }

  @ApiOperation({
    summary: 'Reverse inventory operation',
    description: 'Registers a REVERSED operation for a previously registered inventory operation.',
  })
  @ApiBody({ type: ReverseInventoryMovementRequestDto })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/operations/reverse')
  async reverseInventoryMovement(
    @Body() body: ReverseInventoryMovementRequestDto,
  ): Promise<httpControllerResponse> {
    await this.reverseInventoryMovementCommand.execute(
      body.id_inventory_origin,
      body.id_inventory_destination,
      body.id_inventory_operation_to_reverse,
      body.created_by,
      body.inventory_operation_descriptions,
      body.id_inventory_operation,
      body.created_at,
      body.latitude,
      body.longitude,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory movement reversed successfully.');
  }

  @ApiOperation({
    summary: 'List inventories',
    description: 'Returns a paginated collection of inventories with optional filters.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
  @ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
  @ApiQuery({ name: 'inventory_context', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'inventory_name', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'is_active', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'created_by', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'assigned_to', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'assigned_facility', required: false, type: String, isArray: true })
  @ApiOkResponse({ description: 'Standardized paginated response with inventories collection.', type: [InventoryDto] })
  @Get('')
  async listInventories(
    @Query('limit') limit?: string,
    @Query('next_item') next_item?: string,
    @Query('inventory_context') inventory_context?: string | string[],
    @Query('inventory_name') inventory_name?: string | string[],
    @Query('is_active') is_active?: string | string[],
    @Query('created_by') created_by?: string | string[],
    @Query('assigned_to') assigned_to?: string | string[],
    @Query('assigned_facility') assigned_facility?: string | string[],
  ): Promise<httpControllerResponse> {
    const toArray = (value?: string | string[]): string[] | undefined => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.filter((item) => item.length > 0);

      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    let nextId: string | undefined = undefined;
    let nextDate: string | undefined = undefined;
    let parsedLimit: number | undefined = undefined;

    const inventoryContextValues = toArray(inventory_context);
    const inventoryContextParsed = inventoryContextValues?.map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value));

    const isActiveValues = toArray(is_active);
    const isActiveParsed = isActiveValues?.map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value));

    const httpRequestFormatter = new httpFormatter();
    const httpResponseFormatter = new httpFormatter();

    if (next_item) {
      const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
      nextId = paginationInformation.id;
      if (paginationInformation.created_at) nextDate = paginationInformation.created_at;
    }

    if (limit) parsedLimit = Number.parseInt(limit, 10);

    const data = await this.listInventoriesQuery.execute(
      parsedLimit,
      inventoryContextParsed,
      toArray(inventory_name),
      isActiveParsed,
      toArray(created_by),
      toArray(assigned_to),
      toArray(assigned_facility),
      nextId,
      nextDate,
    );

    return httpResponseFormatter.createResponse(
      'Inventories listed successfully.',
      data,
      parsedLimit,
      'id_inventory',
      'created_at',
    );
  }

  @ApiOperation({
    summary: 'Retrieve inventories by IDs',
    description: 'Retrieves specific inventories by explicit ID list.',
  })
  @ApiBody({ type: RetrieveInventoriesByIdRequestDto })
  @ApiOkResponse({ description: 'Standardized response with retrieved inventories.', type: [InventoryDto] })
  @Post('/ids')
  async retrieveInventoriesById(
    @Body() body: RetrieveInventoriesByIdRequestDto,
  ): Promise<httpControllerResponse> {
    const data = await this.retrieveInventoriesByIdInventoryQuery.execute(body.id_inventory ?? []);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventories retrieved successfully.', data);
  }

  @ApiOperation({
    summary: 'List inventory operations',
    description: 'Returns a paginated collection of inventory operations with optional filters.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
  @ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
  @ApiQuery({ name: 'inventory_operation_referenced', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'movement_type', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'document_reference', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'created_by', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'id_inventory_origin', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'id_inventory_destination', required: false, type: String, isArray: true })
  @ApiOkResponse({ description: 'Standardized paginated response with inventory operations collection.', type: [InventoryOperationDto] })
  @Get('/operations')
  async listInventoryOperations(
    @Query('limit') limit?: string,
    @Query('next_item') next_item?: string,
    @Query('inventory_operation_referenced') inventory_operation_referenced?: string | string[],
    @Query('movement_type') movement_type?: string | string[],
    @Query('document_reference') document_reference?: string | string[],
    @Query('created_by') created_by?: string | string[],
    @Query('id_inventory_origin') id_inventory_origin?: string | string[],
    @Query('id_inventory_destination') id_inventory_destination?: string | string[],
  ): Promise<httpControllerResponse> {
    const toArray = (value?: string | string[]): string[] | undefined => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.filter((item) => item.length > 0);

      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    let nextId: string | undefined = undefined;
    let nextDate: string | undefined = undefined;
    let parsedLimit: number | undefined = undefined;

    const movementTypeValues = toArray(movement_type);
    const movementTypeParsed = movementTypeValues?.map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value));

    const httpRequestFormatter = new httpFormatter();
    const httpResponseFormatter = new httpFormatter();

    if (next_item) {
      const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
      nextId = paginationInformation.id;
      if (paginationInformation.created_at) nextDate = paginationInformation.created_at;
    }

    if (limit) parsedLimit = Number.parseInt(limit, 10);

    const data = await this.listInventoryOperationsQuery.execute(
      parsedLimit,
      toArray(inventory_operation_referenced),
      movementTypeParsed,
      toArray(document_reference),
      toArray(created_by),
      toArray(id_inventory_origin),
      toArray(id_inventory_destination),
      nextId,
      nextDate,
    );

    return httpResponseFormatter.createResponse(
      'Inventory operations listed successfully.',
      data,
      parsedLimit,
      'id_inventory_operation',
      'created_at',
    );
  }

  @ApiOperation({
    summary: 'Retrieve inventory operations by IDs',
    description: 'Retrieves specific inventory operations by explicit ID list.',
  })
  @ApiBody({ type: RetrieveInventoryOperationsByIdRequestDto })
  @ApiOkResponse({ description: 'Standardized response with retrieved inventory operations.', type: [InventoryOperationDto] })
  @Post('/operations/ids')
  async retrieveInventoryOperationsById(
    @Body() body: RetrieveInventoryOperationsByIdRequestDto,
  ): Promise<httpControllerResponse> {
    const data = await this.retrieveInventoryOperationsByIdInventoryOperationQuery.execute(
      body.id_inventory_operation ?? [],
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory operations retrieved successfully.', data);
  }
}
