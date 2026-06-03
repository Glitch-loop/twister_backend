import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";
import { InventoryEntity } from "../entities/inventory.entity";
import { INVENTORY_CONTEXT_ENUM } from "../enums/inventory-context.enum";
import { INVENTORY_STATE_ENUM } from "../enums/inventory-state-enum";

export class InventoryAggregate {
  private inventory: InventoryEntity|null;

  constructor(_invnetory: InventoryEntity|null) {
    this.inventory = _invnetory;
  }

  createNewInventory(
    _id_inventory: string,
    _inventory_context: INVENTORY_CONTEXT_ENUM,
    _inventory_name: string,
    _created_by: string,
    _assigned_to?: string,
    _assigned_facility?: string
  ):InventoryEntity {
    if (_inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL
    || _inventory_context === INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL
    || _inventory_context === INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL
    || _inventory_context === INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL
    ) {
      throw new BusinessRuleException('You are trying to create an inventory of a forbbiden type.');
    }
    
    if (_assigned_to === undefined && _assigned_facility === undefined) {
      throw new BusinessRuleException('For creating a new inventory, you have to assign at least to an user or to a facility.');
    }
    
    // Regex validation
    if (/^\s*$/.test(_inventory_name)) {
      throw new BusinessRuleException('Inventory name cannot be empty or only spaces.');
    }

    this.inventory = new InventoryEntity(
      _id_inventory,
      _inventory_context,
      _inventory_name,
      INVENTORY_STATE_ENUM.ACTIVE,
      new Date(),
      new Date(),
      _created_by,
      [],
      _assigned_facility,
      _assigned_to
    );

    return this.inventory;
  }

  deactivateInventory(): InventoryEntity {
    if (this.inventory === null) throw new Error('The inventory has not been initialized.');

    this.inventory = new InventoryEntity(
      this.inventory.id_inventory,
      this.inventory.inventory_context,
      this.inventory.inventory_name,
      INVENTORY_STATE_ENUM.DEACTIVE,
      this.inventory.created_at,
      new Date(),
      this.inventory.created_by,
      [],
      this.inventory.assigned_facility,
      this.inventory.assigned_to
    );

    return this.inventory;
  }

  reactivateInventory(): InventoryEntity {
    if (this.inventory === null) throw new Error('The inventory has not been initialized.');

    this.inventory = new InventoryEntity(
      this.inventory.id_inventory,
      this.inventory.inventory_context,
      this.inventory.inventory_name,
      INVENTORY_STATE_ENUM.ACTIVE,
      this.inventory.created_at,
      new Date(),
      this.inventory.created_by,
      [],
      this.inventory.assigned_facility,
      this.inventory.assigned_to
    );

    return this.inventory;
  }

  updateInventory(): InventoryEntity {
    if (this.inventory === null) throw new Error('The inventory has not been initialized.');

    this.inventory = new InventoryEntity(
      this.inventory.id_inventory,
      this.inventory.inventory_context,
      this.inventory.inventory_name,
      INVENTORY_STATE_ENUM.ACTIVE,
      this.inventory.created_at,
      new Date(),
      this.inventory.created_by,
      [],
      this.inventory.assigned_facility,
      this.inventory.assigned_to
    );

    return this.inventory;
  }


}