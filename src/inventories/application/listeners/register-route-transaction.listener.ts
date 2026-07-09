// Libraries
import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

// Repositories
import { InventoryRepository } from "@/src/inventories/core/interfaces/Inventory.repository";

// Commands
import { RegisterInventoryOperationForTransactionCommand } from "@/src/inventories/application/commands/register-inventory-operation-for-transaction.command";

// Enums
import { MOVEMENT_TYPE_ENUM } from "@/src/inventories/core/enums/movement-type.enum";
import { INVENTORY_CONTEXT_ENUM } from "@/src/inventories/core/enums/inventory-context.enum";

// Entities
import { InventoryEntity } from "@/src/inventories/core/entities/inventory.entity";

// Sellings - dto
import { TransactionDto } from "@/src/sellings/application/dtos/transaction.dto";

// Shared
import { DOMAIN_EVENT_ENUM } from "@/src/shared/core/enums/domain-event.enum";
import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";

/**
 * Register route transaction listener is a specialized listener for the 
 * routes.
 * 
 * The intention of this listener is to create the proper inventory operation
 * for the "route" transaction.
 */
@Injectable()
export class RegisterTransactionListener {
  constructor(
    @Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
    private readonly registerInventoryOperationForRouteTransaction: RegisterInventoryOperationForTransactionCommand,

  ) { }

  @OnEvent(DOMAIN_EVENT_ENUM.CREATE_TRANSACTION_OPERATION_EVENT, { async: true})
  private async registerRouteTransaction(payload: TransactionDto) {
    const { created_by, id_transaction } = payload;

    // Retrieving possible inventories
    const availableForSaleInventory = await this.inventoryRepository.listInventories(
      1,
      undefined,
      undefined,
      [INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE],
      undefined,
      undefined,
      undefined,
      [created_by]
    );
    const productDevolutionInventory = await this.inventoryRepository.listInventories(
      1,
      undefined,
      undefined,
      [INVENTORY_CONTEXT_ENUM.SHRINKAGE],
      undefined,
      undefined,
      undefined,
      [created_by]
    );
    
    const userAvailableForSaleInventory:InventoryEntity | undefined = availableForSaleInventory.pop();
    const userProductDevolutionInventory:InventoryEntity | undefined = productDevolutionInventory.pop();

    if (userAvailableForSaleInventory === undefined) throw new BusinessRuleException(
      `There is not an inventory with context AVAILABLE FOR SALE for the user ${created_by} to record the inventory operations for the route transaction with id ${id_transaction}`
    );

    if (userProductDevolutionInventory === undefined) throw new BusinessRuleException(
      `There is not an inventory with context SHRINKAGE for the user ${created_by} to record the inventory operations for the route transaction with id ${id_transaction}`
    );
    
    await this.registerInventoryMovement(userProductDevolutionInventory, payload, MOVEMENT_TYPE_ENUM.PRODUCT_DEVOLUTUION);
    await this.registerInventoryMovement(userAvailableForSaleInventory, payload, MOVEMENT_TYPE_ENUM.PRODUCT_REPOSITION);
    await this.registerInventoryMovement(userAvailableForSaleInventory, payload, MOVEMENT_TYPE_ENUM.SELLING);
    await this.registerInventoryMovement(userAvailableForSaleInventory, payload, MOVEMENT_TYPE_ENUM.COURTESY);
  }

  private async registerInventoryMovement(
    _inventory: InventoryEntity,
    _transaction: TransactionDto,
    _movementType: MOVEMENT_TYPE_ENUM) {
    const { created_by, transaction_descriptions, id_transaction, created_at, latitude, longitude } = _transaction;
    const { id_inventory } = _inventory;
    const movementTypeTransaction = transaction_descriptions
      .filter((transactionDesc) => transactionDesc.id_transaction_operation_type as unknown as MOVEMENT_TYPE_ENUM === _movementType); 

    if (movementTypeTransaction.length > 0) {
      await this.registerInventoryOperationForRouteTransaction.execute(
        id_inventory,
        MOVEMENT_TYPE_ENUM.PRODUCT_DEVOLUTUION,
        id_transaction,
        created_by,
        movementTypeTransaction.map((desc) => { 
          return {
            id_inventory_operation_description: desc.id_transaction_description,
            price_at_moment: desc.price_at_moment,
            cost_at_moment: desc.cost_at_moment,
            quantity: desc.quantity,
            id_product: desc.id_product,
            created_at: desc.created_at
          }
        }),
        undefined,
        created_at,
        latitude === null ? undefined : latitude,
        longitude === null ? undefined : longitude
      );
    }
  }
}