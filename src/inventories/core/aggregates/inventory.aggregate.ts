// enums
import { INVENTORY_CONTEXT_ENUM } from "@/src/inventories/core/enums/inventory-context.enum";
import { INVENTORY_STATE_ENUM } from "@/src/inventories/core/enums/inventory-state-enum";
import { STOCK_VALIDATION_ENUM } from "@/src/inventories/core/enums/stock-validation.enum";

// Object values
import { InventoryBalanceObjectValue } from "@/src/inventories/core/value-objects/inventory-balance.object-value";

// Entities
import { InventoryEntity } from "@/src/inventories/core/entities/inventory.entity";

// Shared
import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";

export class InventoryAggregate {
  private inventory: InventoryEntity|null;
  private inventoryBalance: Map<string, InventoryBalanceObjectValue>; // id product - balance product
  private productInOperation: Set<string>;

  private readonly validInventoryContexts = new Set<number>([
    INVENTORY_CONTEXT_ENUM.WAREHOUSE,
    INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION,
    INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
    INVENTORY_CONTEXT_ENUM.SHRINKAGE,
    INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
    INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL,
    INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL,
    INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL,
  ]);

  constructor(_invnetory: InventoryEntity|null) {
    if(_invnetory !== null) {
      this.inventory = this.cloneInventory(_invnetory);
      this.inventoryBalance = this.cloneBalance(_invnetory.inventory_balance);
    } else {
      this.inventory = null;
      this.inventoryBalance = new Map<string, InventoryBalanceObjectValue>();
    }

    this.productInOperation = new Set<string>();
  }

    private cloneInventory(inventory: InventoryEntity): InventoryEntity {
    return new InventoryEntity(
      inventory.id_inventory,
      inventory.inventory_context,
      inventory.inventory_name,
      inventory.is_active,
      inventory.stock_validation,
      new Date(inventory.created_at),
      new Date(inventory.updated_at),
      inventory.created_by,
      inventory.inventory_balance.map((item) => {
        return new InventoryBalanceObjectValue(
          item.id_inventory_balance,
          item.quantity,
          item.min_quantity,
          item.max_quantity,
          item.created_at,
          item.id_inventory,
          item.id_product,
        )
      }),
      inventory.assigned_facility,
      inventory.assigned_to,
    );
  }

  private cloneBalance(inventoryItems: InventoryBalanceObjectValue[]): Map<string, InventoryBalanceObjectValue> {
    const balanceOfProductMap: Map<string, InventoryBalanceObjectValue> = new Map<string, InventoryBalanceObjectValue>();
    for (const item of inventoryItems) {
      const { id_product, id_inventory } = item;
      
      if(balanceOfProductMap.has(id_product)) 
        throw new BusinessRuleException(`The product with id ${id_product} appears twice in inventory with id ${id_inventory}`);

      balanceOfProductMap.set(id_product, item);
    }

    return balanceOfProductMap;
  }


  createNewInventory(
    _id_inventory: string,
    _inventory_context: INVENTORY_CONTEXT_ENUM,
    _stock_validation: STOCK_VALIDATION_ENUM,
    _inventory_name: string,
    _created_by: string,
    _assigned_to?: string,
    _assigned_facility?: string
  ):InventoryEntity {
    if (!this.isValidInventoryContext(_inventory_context)) {
      throw new BusinessRuleException('You are trying to create an inventory in a context that does not exist.');
    }

    if (!this.isValidInventoryContext(_inventory_context)) {
      throw new BusinessRuleException('You are trying to create an inventory with an invalid context.');
    }

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
      _stock_validation,
      new Date(),
      new Date(),
      _created_by,
      [],
      _assigned_facility ? _assigned_facility : null,
      _assigned_to ? _assigned_to : null
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
      this.inventory.stock_validation,
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
      this.inventory.stock_validation,
      this.inventory.created_at,
      new Date(),
      this.inventory.created_by,
      [],
      this.inventory.assigned_facility,
      this.inventory.assigned_to
    );

    return this.inventory;
  }

  updateInventory(inventory_name?: string, stock_validation?: STOCK_VALIDATION_ENUM): InventoryEntity {
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
      inventory_name ? inventory_name.trim() : this.inventory.inventory_name,
      this.inventory.is_active,
      stock_validation ?? this.inventory.stock_validation,
      this.inventory.created_at,
      new Date(),
      this.inventory.created_by,
      [],
      this.inventory.assigned_facility,
      this.inventory.assigned_to
    );

    return this.inventory;
  }

  establishLimitsForInventoryBalance(
    _idProduct: string, 
    _minQuantity: number|null, 
    _maxQuantity: number|null,
    _idNewProductInInventory: string) {
    if (this.inventory === null) throw new Error('The inventory has not been initialized.');

    if(this.isForbiddenInventory(this.inventory.inventory_context)) {
      throw new BusinessRuleException(`You cannot update the inventory with the id: ${this.inventory.id_inventory} because it's an special inventory.`);
    }

    const { id_inventory } = this.inventory;
    
    if(this.inventoryBalance.has(_idProduct)) { // This product is already considered in the controller.
      const { id_inventory_balance, quantity, created_at, id_inventory, id_product } = this.inventoryBalance.get(_idProduct)!;
      this.inventoryBalance.set(
        id_product,
        new InventoryBalanceObjectValue(
          id_inventory_balance,
          quantity,
          _minQuantity,
          _maxQuantity,
          created_at,
          id_inventory,
          id_product
        )
      );
    } else { // New product in the inventory
      this.inventoryBalance.set(
        _idProduct,
        new InventoryBalanceObjectValue(
          _idNewProductInInventory,
          0,
          _minQuantity,
          _maxQuantity,
          new Date(),
          id_inventory,
          _idProduct
        )
      );
    }

    this.productInOperation.add(_idProduct);
  }

  getAffectedInventoryBalance() {
    return this.getAffectedInventoryBalanceRecordsFromInventoryBalance(this.inventoryBalance);
  }

  private getAffectedInventoryBalanceRecordsFromInventoryBalance(_inventoryBalanceMap: Map<string, InventoryBalanceObjectValue>): InventoryBalanceObjectValue[] {
    const affectedInventoryBalance: InventoryBalanceObjectValue[] = [];
    for (const idProductWithMovement of this.productInOperation) {
      affectedInventoryBalance.push(_inventoryBalanceMap.get(idProductWithMovement)!);
    }
    return affectedInventoryBalance;
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

  private isValidInventoryContext(_inventory_context: unknown): boolean {
    return typeof _inventory_context === 'number' && this.validInventoryContexts.has(_inventory_context);
  }

}