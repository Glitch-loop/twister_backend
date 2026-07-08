// Libraries
import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

// Entities
import { InventoryOperationEntity } from "@/src/inventories/core/entities/inventory-operation.entity";

// Commands
import { ReverseInventoryMovementCommand } from "@/src/inventories/application/commands/reverse-inventory-movement.command";

// Enums
import { InventoryRepository } from "@/src/inventories/core/interfaces/Inventory.repository";

// Sellings - Dtos
import { TransactionDto } from "@/src/sellings/application/dtos/transaction.dto";

// Shared
import { DOMAIN_EVENT_ENUM } from "@/src/shared/core/enums/domain-event.enum";
import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";

/**
 * Register route transaction listener is a specialized listener for the 
 * routes.
 * 
 * The intention of this listener is to reverse the inventory operation 
 * that reference to the transaction that is being cancelled.
 */

@Injectable()
export class CancelTransactionListener {
  constructor(
    @Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
    private readonly reverseInventoryMovementCommand: ReverseInventoryMovementCommand,
  ) { }

  @OnEvent(DOMAIN_EVENT_ENUM.CANCEL_TRANSACTION_OPERATION_EVENT, { async: true})
  private async cancelRouteTransaction(payload: TransactionDto) {
    const { id_transaction } = payload;

    const inventoryOperations:InventoryOperationEntity[] = await this.inventoryRepository.listInventoryOperations(
      1,
      undefined,
      undefined,
      undefined,
      undefined,
      [ id_transaction ],
      undefined,
      undefined,
      undefined
    );

    const inventoryOperationToCancel = inventoryOperations.pop();

    if (inventoryOperationToCancel === undefined) throw new BusinessRuleException(
      `Error at moment of reversing (cancelling the inventory operation ofr transaction). There is not an inventory operation that refers to the transaction with the ${id_transaction}.`
    );

    await this.reverseInventoryMovementCommand.execute(
      inventoryOperationToCancel.id_inventory_operation,
      new Date().toISOString()
    )
  }
}