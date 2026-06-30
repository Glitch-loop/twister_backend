import { InventoryOperationEntity } from "@/src/inventories/core/entities/inventory-operation.entity";
import { InventoryEntity } from "@/src/inventories/core/entities/inventory.entity";
import { InventoryBalanceObjectValue } from "@/src/inventories/core/value-objects/inventory-balance.object-value";


export abstract class Inventory {
  abstract CreateInventory(Inventory: InventoryEntity): Promise<void>;
  abstract UpdateInventory(Inventory: InventoryEntity): Promise<void>;
  abstract CreateInventoryOperation(InventoryOperation: InventoryOperationEntity): Promise<void>;
  abstract UpsertInventoryBalance(InventoryBalance: InventoryBalanceObjectValue): Promise<void>;
  abstract listInventoryOperations(
    limit: number,
    lastCreatedAt?: string,
    lastIdInventoryOperation?: string,
    inventory_operation_reference?: string[],
    movement_type?: number[],
    document_reference?: string[],
    created_by?: string[],
    id_inventory_origin?: string[],
    id_inventory_target?: string[],
  ): Promise<InventoryOperationEntity[]>;
  abstract retrieveInventoryOperations(idInventoryOperations: string[]): Promise<InventoryOperationEntity[]>;
  abstract listInventories(
    limit: number,
    lastCreatedAt?: string,
    lastIdInventory?: string,
    inventory_context?: number[],
    inventory_name?: string[],
    is_active?: number[],
    created_by?: string[],
    assigned_to?: string[],
    assigned_facility?: string[],
  ): Promise<InventoryEntity[]>;
  abstract retrieveInventories(idInventories: string[]): Promise<InventoryEntity[]>;
}