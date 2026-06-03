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
    if(this.isForbiddenInventory(_inventory_context)) {
      throw new BusinessRuleException('You are trying to create an inventory of a forbbiden type.');
    }
    
    if (_assigned_to === undefined && _assigned_facility === undefined) {
      throw new BusinessRuleException('For creating a new inventory, you have to assign to the inventory at least an user or a facility.');
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
    
    if(this.isForbiddenInventory(this.inventory.inventory_context)) {
      throw new BusinessRuleException(`You cannot deactivate the inventory with the id: ${this.inventory.id_inventory} because it's an special inventory.`);
    }

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

    if(this.isForbiddenInventory(this.inventory.inventory_context)) {
      throw new BusinessRuleException(`You cannot reactivate the inventory with the id: ${this.inventory.id_inventory} because it's an special inventory.`);
    }

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

  updateInventory(inventory_name: string): InventoryEntity {
    /*
      Business rule (06-03-26)
      The user can modify only the inventory name from those allowed inventories. 
    */
    /*
      Business rule (06-03-26)
      Inventory context cannot be updated; If the user could, it will be a source of bugs and it will potentially break the 
      system. 
    */
    if (this.inventory === null) throw new Error('The inventory has not been initialized.');

    if(this.isForbiddenInventory(this.inventory.inventory_context)) {
      throw new BusinessRuleException(`You cannot update the inventory with the id: ${this.inventory.id_inventory} because it's an special inventory.`);
    }

    if(this.inventory.is_active === INVENTORY_STATE_ENUM.DEACTIVE) {
      throw new BusinessRuleException(`You cannot perform this operation because the inventory (${this.inventory.id_inventory}) is deactivated.`);
    }

    this.inventory = new InventoryEntity(
      this.inventory.id_inventory,
      this.inventory.inventory_context,
      inventory_name,
      this.inventory.is_active,
      this.inventory.created_at,
      new Date(),
      this.inventory.created_by,
      [],
      this.inventory.assigned_facility,
      this.inventory.assigned_to
    );

    return this.inventory;
  }

  private isForbiddenInventory(_inventory_context):boolean {
    if (_inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL
    || _inventory_context === INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL
    || _inventory_context === INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL
    || _inventory_context === INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL
    ) {
      return true;
    } else {
      return false;
    }
  }

}