// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Commands
import { RegisterInventoryOperationBetweenInventoriesCommand } from '@/src/inventories/application/commands/register-inventory-operation-between-inventories.command';

// Dtos
import { RouteInventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/route-inventory-operation-description.dto';

// Mappers
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';

// Entities
import { InventoryConfigurationForOperationEntity } from '@/src/inventories/core/entities/inventory-configuration-for-operation.entity';

// Enums
import { ROUTE_INVENTORY_OPERATION_TYPE } from '@/src/inventories/core/enums/route-inventory-operation-type.enum';

// Repository
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';

// Object values
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

// Errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';


@Injectable()
export class RegisterRouteInventoryOperationCommand {
  constructor(
    @Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
    private readonly mapper: EntityDtoMapper,
    private readonly registerInventoryOperationBetweenInventoriesCommand: RegisterInventoryOperationBetweenInventoriesCommand
  ) {}

  async executeUseCase(
    id_inventory_operation: string,
    created_at: string,
    id_inventory_operation_type: ROUTE_INVENTORY_OPERATION_TYPE,
    id_user: string,
    inventory_operation_descriptions: InventoryOperationDescriptionObjectValue[]
  ): Promise<void> {
    let inventoryConfigurationErrorMessage: string = 'An error has been occured while registering route inventory operation. Verify the inventory configuration is set properly'
    if (inventory_operation_descriptions.length === 0) {
      throw new BusinessRuleException('Inventory operation descriptions are required.');
    }

    const createdAtDate = this.toDate(created_at, 'RouteInventoryOperationDto.date');
      
    const inventoryConfigurations: InventoryConfigurationForOperationEntity[] = await this.inventoryRepository.listInventoryConfigurationForOperations([], [ id_user ], []);
    const inventoryConfig = inventoryConfigurations
      .find((invConfig) => invConfig.inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE === id_inventory_operation_type);

    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.start_shift_inventory) inventoryConfigurationErrorMessage = `Error at moment of registering start shift inventory (${ROUTE_INVENTORY_OPERATION_TYPE.start_shift_inventory}). There is not an inventory configuration for the user: ${id_user} to handle this case.`;
    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.restock_inventory) inventoryConfigurationErrorMessage = `Error at moment of registering restock inventory (${ROUTE_INVENTORY_OPERATION_TYPE.restock_inventory}). There is not an inventory configuration for the user: ${id_user} to handle this case.`;
    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.product_devolution_inventory) inventoryConfigurationErrorMessage = `Error at moment of registering product devolution inventory (${ROUTE_INVENTORY_OPERATION_TYPE.product_devolution_inventory}). There is not an inventory configuration for the user: ${id_user} to handle this case.`;
    if (id_inventory_operation_type === ROUTE_INVENTORY_OPERATION_TYPE.end_shift_inventory) inventoryConfigurationErrorMessage = `Error at moment of registering end shift inventory  (${ROUTE_INVENTORY_OPERATION_TYPE.end_shift_inventory}). There is not an inventory configuration for the user: ${id_user} to handle this case.`;
    
    if (inventoryConfig === undefined) throw new BusinessRuleException(inventoryConfigurationErrorMessage); 
    
    await this.registerInventoryOperationBetweenInventoriesCommand.execute(
      inventoryConfig.origin_inventory,
      inventoryConfig.target_inventory,
      id_user,
      inventory_operation_descriptions,
      id_inventory_operation,
      createdAtDate,
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

  private toDate(value: Date | string, fieldName: string): Date {
    const parsedDate = value instanceof Date ? value : new Date(value);

    if (isNaN(parsedDate.getTime())) {
      throw new BusinessRuleException(`Invalid ${fieldName} format`);
    }

    return parsedDate;

  }
}