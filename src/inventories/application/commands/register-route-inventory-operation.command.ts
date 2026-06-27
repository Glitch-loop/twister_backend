// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Commands
import { RegisterInventoryOperatonBetweenInventoriesCommand } from '@/src/inventories/application/commands/register-inventory-operaton-between-inventories.command';
import { RegisterProductDevolutionCommand } from '@/src/inventories/application/commands/register-product-devolution.command';
import { RegisterWasteInventoryOperationCommand } from '@/src/inventories/application/commands/register-waste-inventory-operation.command';
import { ReverseInventoryMovementCommand } from '@/src/inventories/application/commands/reverse-inventory-movement.command';

// Dtos
import { RouteInventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/route-inventory-operation-description.dto';

// Mappers
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';

// Entities
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';

// Enums
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { ROUTE_INVENTORY_OPERATION_TYPE } from '@/src/inventories/core/enums/route-inventory-operation-type.enum';

// Repository
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

// Object values
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

// Errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';


@Injectable()
export class RegisterRouteInventoryOperationCommand {
  constructor(
    @Inject(Inventory) private readonly inventoryRepository: Inventory,
    private readonly mapper: EntityDtoMapper,
    private readonly registerInventoryOperatonBetweenInventoriesCommand: RegisterInventoryOperatonBetweenInventoriesCommand,
    private readonly registerProductDevolutionCommand: RegisterProductDevolutionCommand,
    private readonly registerWasteInventoryOperationCommand: RegisterWasteInventoryOperationCommand,
    private readonly reverseInventoryMovementCommand: ReverseInventoryMovementCommand,
  ) {}

  async executeUseCase(
    id_inventory_operation: string,
    created_at: string,
    id_inventory_operation_type: ROUTE_INVENTORY_OPERATION_TYPE,
    id_user: string,
    inventory_operation_descriptions: InventoryOperationDescriptionObjectValue[]
  ): Promise<void> {
    if (inventory_operation_descriptions.length === 0) {
      throw new BusinessRuleException('Inventory operation descriptions are required.');
    }

    const createdAtDate = this.toDate(created_at, 'RouteInventoryOperationDto.date');

    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.start_shift_inventory) {
      const reservationInventory = await this.retrieveInventoryByContextForUser(
        INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION,
        id_user,
      );
      const availableInventory = await this.retrieveInventoryByContextForUser(
        INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
        id_user,
      );

      await this.registerInventoryOperatonBetweenInventoriesCommand.execute(
        reservationInventory.id_inventory,
        availableInventory.id_inventory,
        id_user,
        inventory_operation_descriptions,
        id_inventory_operation,
        createdAtDate,
      );
      return;
    }

    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.restock_inventory) {
      const warehouseInventory = await this.retrieveUniqueInventoryByContext(
        INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      );
      const availableInventory = await this.retrieveInventoryByContextForUser(
        INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
        id_user,
      );

      await this.registerInventoryOperatonBetweenInventoriesCommand.execute(
        warehouseInventory.id_inventory,
        availableInventory.id_inventory,
        id_user,
        inventory_operation_descriptions,
        id_inventory_operation,
        createdAtDate,
      );
      return;
    }

    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.product_devolution_inventory) {
      const availableInventory = await this.retrieveInventoryByContextForUser(
        INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
        id_user,
      );

      await this.registerProductDevolutionCommand.execute(
        availableInventory.id_inventory,
        id_user,
        inventory_operation_descriptions,
        undefined,
        id_inventory_operation,
        createdAtDate,
      );

      const shrinkageInventory = await this.retrieveUniqueInventoryByContext(
        INVENTORY_CONTEXT_ENUM.SHRINKAGE,
      );

      await this.registerWasteInventoryOperationCommand.execute(
        shrinkageInventory.id_inventory,
        id_user,
        inventory_operation_descriptions,
        undefined,
        createdAtDate,
      );
      return;
    }

    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.end_shift_inventory) {
      const availableInventory = await this.retrieveInventoryByContextForUser(
        INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
        id_user,
      );
      const warehouseInventory = await this.retrieveUniqueInventoryByContext(
        INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      );

      await this.registerInventoryOperatonBetweenInventoriesCommand.execute(
        availableInventory.id_inventory,
        warehouseInventory.id_inventory,
        id_user,
        inventory_operation_descriptions,
        id_inventory_operation,
        createdAtDate,
      );
      return;
    }

    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.cancel_inventory_operation) {
      const inventoryOperationToReverse = await this.retrieveInventoryOperationById(
        id_inventory_operation,
      );

      await this.reverseInventoryMovementCommand.execute(
        inventoryOperationToReverse.id_inventory_origin,
        inventoryOperationToReverse.id_inventory_target,
        id_inventory_operation,
        id_user,
        inventory_operation_descriptions,
        undefined,
        createdAtDate,
      );
      return;
    }

    throw new BusinessRuleException(
      `Route inventory operation type ${id_inventory_operation_type} is not supported.`,
    );
  }

  async execute(
    id_inventory_operation: string,
    created_at: string,
    id_inventory_operation_type: ROUTE_INVENTORY_OPERATION_TYPE,
    id_user: string,
    inventory_operation_descriptions: RouteInventoryOperationDescriptionDto[]
  ): Promise<void> {
    await this.executeUseCase(
      id_inventory_operation,
      created_at,
      id_inventory_operation_type,
      id_user,
      inventory_operation_descriptions.map((desc) => this.mapper.toDomainObject(desc))
    );

  }

  private async retrieveInventoryByContextForUser(
    inventory_context: INVENTORY_CONTEXT_ENUM,
    id_user: string,
  ): Promise<InventoryEntity> {
    const inventories = await this.inventoryRepository.listInventories(
      2,
      undefined,
      undefined,
      [inventory_context],
      undefined,
      undefined,
      undefined,
      [id_user],
    );

    if (inventories.length === 0) {
      throw new BusinessRuleException(
        `Expected one inventory with context ${inventory_context} assigned to user ${id_user}, but none was found.`,
      );
    }

    if (inventories.length > 1) {
      throw new BusinessRuleException(
        `Expected one inventory with context ${inventory_context} assigned to user ${id_user}, but found ${inventories.length}.`,
      );
    }

    return inventories[0];
  }

  private async retrieveUniqueInventoryByContext(
    inventory_context: INVENTORY_CONTEXT_ENUM,
  ): Promise<InventoryEntity> {
    const inventories = await this.inventoryRepository.listInventories(
      2,
      undefined,
      undefined,
      [inventory_context],
    );

    if (inventories.length === 0) {
      throw new BusinessRuleException(
        `Expected one inventory with context ${inventory_context}, but none was found.`,
      );
    }

    if (inventories.length > 1) {
      throw new BusinessRuleException(
        `Expected one inventory with context ${inventory_context}, but found ${inventories.length}.`,
      );
    }

    return inventories[0];
  }

  private async retrieveInventoryOperationById(id_inventory_operation: string): Promise<InventoryOperationEntity> {
    const inventoryOperations = await this.inventoryRepository.retrieveInventoryOperations([
      id_inventory_operation,
    ]);

    if (inventoryOperations.length === 0) {
      throw new BusinessRuleException(
        `Inventory operation with id ${id_inventory_operation} does not exist and cannot be reversed.`,
      );
    }

    return inventoryOperations[0];
  }

  private toDate(value: Date | string, fieldName: string): Date {
    const parsedDate = value instanceof Date ? value : new Date(value);

    if (isNaN(parsedDate.getTime())) {
      throw new BusinessRuleException(`Invalid ${fieldName} format`);
    }

    return parsedDate;

  }
}