// Object values
import { InventoryBalanceObjectValue } from "@/src/inventories/core/value-objects/inventory-balance.object-value";
import { InventoryOperationDescriptionObjectValue } from "@/src/inventories/core/value-objects/inventory-operation-description.object-value";

// Entities
import { InventoryEntity } from "@/src/inventories/core/entities/inventory.entity";
import { InventoryOperationEntity } from "@/src/inventories/core/entities/inventory-operation.entity";

// Enums
import { MOVEMENT_TYPE_ENUM } from "@/src/inventories/core/enums/movement-type.enum";
import { INVENTORY_STATE_ENUM } from "@/src/inventories/core/enums/inventory-state-enum";
import { INVENTORY_CONTEXT_ENUM } from "@/src/inventories/core/enums/inventory-context.enum";

// Shared
import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";


export class InventoryOperationAggregate {
  // About inventories
  private readonly originInventory: InventoryEntity;
  private readonly targetInventory: InventoryEntity;
  private readonly originInventoryBalance: Map<string, InventoryBalanceObjectValue>; // id product - balance product
  private readonly targetInventoryBalance: Map<string, InventoryBalanceObjectValue>; // id product - balance product
  
  // About inventory operation
  private inventoryOperation: InventoryOperationEntity|null;
  private inventoryOperationDescriptions: InventoryOperationDescriptionObjectValue[];
  private productInInventoryOperationDescriptionSet: Set<string>;

  constructor(
    _originInventory: InventoryEntity,
    _targetInventory: InventoryEntity,
  ) {
    this.originInventory = this.cloneInventory(_originInventory);
    this.targetInventory = this.cloneInventory(_targetInventory);


    this.originInventoryBalance = this.cloneBalance(this.originInventory.inventory_balance)
    this.targetInventoryBalance = this.cloneBalance(this.targetInventory.inventory_balance)
    
    this.inventoryOperation = null;
    this.inventoryOperationDescriptions = [];
    this.productInInventoryOperationDescriptionSet = new Set<string>();
  }

  private cloneInventory(inventory: InventoryEntity): InventoryEntity {
    return new InventoryEntity(
      inventory.id_inventory,
      inventory.inventory_context,
      inventory.inventory_name,
      inventory.is_active,
      new Date(inventory.created_at),
      new Date(inventory.updated_at),
      inventory.created_by,
      [],
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

  createInventoryOperationForTransaction (
    _idInventoryOperation: string,
    _movementType: MOVEMENT_TYPE_ENUM,
    _CreatedBy: string,
    _createdAt: Date,
    _documentReference?: string,
    _latitude?: string, 
    _longitude?: string
  ) {
    this.assertionInventoryInvolvedActive();

    if (!(_movementType === MOVEMENT_TYPE_ENUM.SELLING || _movementType === MOVEMENT_TYPE_ENUM.PRODUCT_REPOSITION)) 
      throw new BusinessRuleException(`You are trying to create an invalid movement type (selling or product reposition) in an inventory operation for transaction.`)

    if (_documentReference === undefined) 
      throw new BusinessRuleException(`For creating one of the following movements: SELLING or PRODUCT_REPOSITION, you have to provide the id of the transaction that originated the movement.`);

    if (!(this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)) 
      throw new BusinessRuleException(`For creating a movement for route transaction (SELLING or PRODUCT_REPOSITION), the origin inventory must be AVAILABLE_FOR_SALE type.`);

    if (!(this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL)) 
      throw new BusinessRuleException(`For creating a movement for route transaction (SELLING or PRODUCT_REPOSITION), the target inventory must be CLIENT_VIRTUAL type.`)
  
    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _latitude ? _latitude : null,
      _longitude ? _longitude : null,
      _movementType,
      _createdAt,
      _CreatedBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      undefined,
      _documentReference
    )
  }

  createProductDevolutionForTransaction (
    _idInventoryOperation: string,
    _CreatedBy: string,
    _createdAt: Date,
    _latitude?: string, 
    _longitude?: string,
    _documentReference?: string,
  ) {
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();
    this.assertionInventoryInvolvedActive();

    if (_documentReference === undefined) 
      throw new BusinessRuleException(`For creating a PRODUCT_DEVOLUTION, you have to provide the id of the transaction that originated the movement.`);

    if (!(this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL)) 
      throw new BusinessRuleException(`For creating a PRODUCT_DEVOLUTION movement for a route transaction, the origin inventory must be CLIENT_VIRTUAL type.`);

    if (!(this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.SHRINKAGE)) 
      throw new BusinessRuleException(`For creating a PRODUCT_DEVOLUTION movement for a route transaction, the target inventory must be SHRINKAGE type.`);
  
    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _latitude ? _latitude : null,
      _longitude ? _longitude : null,
      MOVEMENT_TYPE_ENUM.PRODUCT_DEVOLUTUION,
      _createdAt,
      _CreatedBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      undefined,
      _documentReference
    );
    
  }

  reverseInventoryOperation (
    _idInventoryOperation: string,
    _createdBy: string,
    _createdAt: Date,
    _inventoryOperation: InventoryOperationEntity
  ) {
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();
    this.assertionInventoryInvolvedActive();

    const { id_inventory_operation, movement_type } = _inventoryOperation;

    if (movement_type === MOVEMENT_TYPE_ENUM.REVERSED) 
      throw new BusinessRuleException(`REVERSE (CANCEL) operation cannot be reversed (cancelled).`);

    if (_inventoryOperation === undefined || _inventoryOperation === null) 
      throw new BusinessRuleException(`For creating a REVERSE inventory operation, you have to provide the id of the inventory operation to be reversed.`);

    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _inventoryOperation.latitude,
      _inventoryOperation.longitude,
      MOVEMENT_TYPE_ENUM.REVERSED,
      _createdAt,
      _createdBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      id_inventory_operation,
      undefined
    );

    // TODO: Add information
  }

  createInternalInventoryOperation (
    _idInventoryOperation: string,
    _createdBy: string,
    _createdAt: Date,
    _latitude?: string, 
    _longitude?: string,
  ) {
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();
    this.assertionInventoryInvolvedActive();

    if (!(this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.WAREHOUSE
    || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION
    || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE
    || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.SHRINKAGE)) 
      throw new BusinessRuleException(`Invalid intentory type for origin inventory (id: ${this.originInventory.inventory_context}), it must be of type WAREHOUSE, PRODUCT_RESERVATION, AVAILABLE_FOR_SALE, SHRINKAGE.`);

    if (!(this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.WAREHOUSE
    || this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION
    || this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE
    || this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.SHRINKAGE)) 
      throw new BusinessRuleException(`Invalid intentory type for target inventory (id: ${this.originInventory.inventory_context}), it must be of type WAREHOUSE, PRODUCT_RESERVATION, AVAILABLE_FOR_SALE, SHRINKAGE.`);

    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _latitude ? _latitude : null,
      _longitude ? _longitude : null,
      MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      _createdAt,
      _createdBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      undefined,
      undefined
    );      
  }
    
  createAdjustmentOperation (
    _idInventoryOperation: string,
    _createdBy: string,
    _createdAt: Date,
    _latitude?: string,
    _longitude?: string,
  ) {
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();
    this.assertionInventoryInvolvedActive();

    if (this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL
      || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL
      || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL
      || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL) {
      throw new BusinessRuleException(
        `Invalid inventory type for origin inventory (id: ${this.originInventory.inventory_context}), it cannot be virtual.`,
      );
    }

    if (this.targetInventory.inventory_context !== INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL) {
      throw new BusinessRuleException(
        `Invalid inventory type for target inventory (id: ${this.targetInventory.inventory_context}), it must be ADJUSTMENT_VIRTUAL.`,
      );
    }

    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _latitude ? _latitude : null,
      _longitude ? _longitude : null,
      MOVEMENT_TYPE_ENUM.ADJUSTMENT,
      _createdAt,
      _createdBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      undefined,
      undefined
    );
  }

  createSupplierRecipt(
    _idInventoryOperation: string,
    _createdBy: string,
    _createdAt: Date,
    _latitude?: string, 
    _longitude?: string,    
  ) {
    this.assertionInventoryInvolvedActive();
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();

    if (this.originInventory.inventory_context !== INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL) {
      throw new BusinessRuleException(
        `Invalid inventory type for origin inventory (id: ${this.originInventory.inventory_context}), it must be INVENTORY_SUPPLIER_VIRTUAL.`,
      );
    }

    if (!(this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.WAREHOUSE
      || this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION
      || this.targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE)) {
      throw new BusinessRuleException(
        `Invalid inventory type for target inventory (id: ${this.targetInventory.inventory_context}), it must be WAREHOUSE, PRODUCT_RESERVATION, or AVAILABLE_FOR_SALE.`,
      );
    }

    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _latitude ? _latitude : null,
      _longitude ? _longitude : null,
      MOVEMENT_TYPE_ENUM.SUPPLIER_RECIPT,
      _createdAt,
      _createdBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      undefined,
      undefined
    );
  }
  
  createInventoryScrap(
    _idInventoryOperation: string,
    _createdBy: string,
    _createdAt: Date,
    _latitude?: string,
    _longitude?: string,
  ) {
    this.assertionInventoryInvolvedActive();
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();

    if (!(this.originInventory.inventory_context ===  INVENTORY_CONTEXT_ENUM.WAREHOUSE
      || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION
      || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE
      || this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.SHRINKAGE)) {
      throw new BusinessRuleException(
        `Invalid inventory type for origin inventory (id: ${this.originInventory.inventory_context}), it must be WAREHOUSE, PRODUCT_RESERVATION, AVAILABLE_FOR_SALE, or SHRINKAGE.`,
      );
    }

    if (this.targetInventory.inventory_context !== INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL) {
      throw new BusinessRuleException(
        `Invalid inventory type for target inventory (id: ${this.targetInventory.inventory_context}), it must be WASTED_VIRTUAL.`,
      );
    }

    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _latitude ? _latitude : null,
      _longitude ? _longitude : null,
      MOVEMENT_TYPE_ENUM.INVENTORY_SCRAP,
      _createdAt,
      _createdBy,
      this.originInventory.id_inventory,
      this.targetInventory.id_inventory,
      [],
      undefined,
      undefined
    );
  }

  addInventoryOperationDescription(
    _idProductOperationDescription: string,
    _priceAtMoment: number,
    _costAtMoment: number,
    _quantity: number,
    _idProduct: string,
    _idNewProductInOriginInventory: string,
    _idNewProductInTargetInventory: string,
    _createdAt: Date,
  ) {
    /*
      Business rule (06-04-26)
      A product can only appear once in an inventory operation.
    */

    // Validating an inventory operation exists.
    this.isInventoryOperationInitialized();
    const { id_inventory_operation, movement_type } = this.inventoryOperation!
    
    if (!(movement_type === MOVEMENT_TYPE_ENUM.REVERSED || movement_type === MOVEMENT_TYPE_ENUM.ADJUSTMENT) && _quantity < 0) 
      throw new BusinessRuleException(`Negative inventory operation description is not allowed (id product: ${_idProduct}, quantity: ${_quantity}). The unique contexts on which this operation is allowed are: ADJUSTMENTS or REVERSED (CANCEL) operation.`)

    // Validating an inventory operation with a product don't appear twice.
    if (this.productInInventoryOperationDescriptionSet.has(_idProduct)) throw new BusinessRuleException(`You have added an operation description with the same id product (${_idProduct}) in the inventory operation.`);
    this.productInInventoryOperationDescriptionSet.add(_idProduct);

    // Validating the inventories has enough product
    /*
      Note about inventory descriptions (06-05-26):
      Inventory operations was designed in such way that it is taking into account both inventories:
      - The inventory which the product is outflowing (origin).
      - The inventory which the product is inflowing (target).

      This design brings the following scenarios:
      1. When _quantity is positive.
        - It's a negative movement (product is taken) for origin inventory.
        - It's a positive movement (product is placed) for target inventory.
    
      2. When _quantity is negative.
          - It's a positive movement (product is placed) for origin inventory.
          - It's a negative movement (product is taken) for target inventory.
      
      Notes about when _quantity is negative:
      This case is only allowed when:
       1. Inventory operation is reversed. The user wants to undo an operation.
       2. When there is an adjustment. The user saw a discrepancy that might imply a decrease the amount of a quantity.
    */
    /*
      Note about special inventories (06-05-26):
      Special inventories doesn't have an inventory balance since they are abstractions of entities or concepts, so it isn't
      necessary to validate if an special inventory has enough product.
    */
    if(!this.isSpecialInventory(this.originInventory)) {
      const { id_inventory } = this.originInventory
      const productBalance = this.originInventoryBalance.get(_idProduct);
      
      if (productBalance) { // This particular product has appeared previoulsy in this inventory balance.
        const { 
          id_inventory_balance, 
          quantity,
          id_inventory,
          created_at,
          id_product
        } = productBalance;
        if (productBalance.quantity - _quantity < 0) throw new BusinessRuleException(`The inventory balance with id ${id_inventory_balance} (representing the product ${_idProduct}) of the origin inventory with id ${id_inventory} doesn't have enough product to complete the operation. Current balance: ${quantity}. Items to take from the balance: ${_quantity}`);
        this.originInventoryBalance.set(_idProduct, new InventoryBalanceObjectValue(
          id_inventory_balance,
          quantity - _quantity,
          created_at,
          id_inventory,
          id_product
        ));
      } else { // This particular particular has not been appeard in this inventory balance (First time it appears).
        if (_quantity * -1 < 0)  throw new BusinessRuleException(`You are trying to take product that doesn't exist. The inventory origin with id ${id_inventory} doesn't have product with id ${_idProduct}. Firstly, you have to add balance of this product before taking it.`);
        this.originInventoryBalance.set(
          _idProduct,
          new InventoryBalanceObjectValue(
            _idNewProductInOriginInventory,
            _quantity * -1,
            new Date(),
            id_inventory,
            _idProduct
          )
        )
      }
    }

    if(!this.isSpecialInventory(this.targetInventory)) {
      const { id_inventory } = this.targetInventory
      const productBalance = this.targetInventoryBalance.get(_idProduct);
      
      if (productBalance) { // This particular product has appeared previoulsy in this inventory balance.
        const { 
          id_inventory_balance, 
          quantity,
          id_inventory,
          created_at,
          id_product
        } = productBalance;
        if (productBalance.quantity + _quantity < 0) throw new BusinessRuleException(`The inventory balance with id ${id_inventory_balance} (representing the product ${_idProduct}) of the target inventory with id ${id_inventory} doesn't have enough product to complete the operation. Current balance: ${quantity}. Items to take from the balance: ${_quantity}`);
        this.targetInventoryBalance.set(_idProduct, new InventoryBalanceObjectValue(
          id_inventory_balance,
          quantity + _quantity,
          created_at,
          id_inventory,
          id_product
        ));
      } else { // This particular particular has not been appeard in this inventory balance (First time it appears).
        if (_quantity < 0) throw new BusinessRuleException(`You are trying to take product that doesn't exist. The target inventory with id ${id_inventory} doesn't have product with id ${_idProduct}. Firstly, you have to add balance of this product before taking it.`);
        this.targetInventoryBalance.set(
          _idProduct,
          new InventoryBalanceObjectValue(
            _idNewProductInTargetInventory,
            _quantity,
            new Date(),
            id_inventory,
            _idProduct
          )
        ) 
      }
    }
    
    // Adding inventory operation description.
    this.inventoryOperationDescriptions.push(
      new InventoryOperationDescriptionObjectValue(
        _idProductOperationDescription,
        _priceAtMoment,
        _costAtMoment,
        _quantity,
        _createdAt,
        id_inventory_operation,
        _idProduct
      )
    );
  }

  getInventoryOperation(): InventoryOperationEntity {
    this.isInventoryOperationInitialized();
    
    const { 
      id_inventory_operation,
      latitude,
      longitude,
      movement_type,
      created_at,
      created_by,
      id_inventory_origin,
      id_inventory_destination,
      document_reference,
    } = this.inventoryOperation!;

    return new InventoryOperationEntity(
      id_inventory_operation,
      latitude,
      longitude,
      movement_type,
      created_at,
      created_by,
      id_inventory_origin,
      id_inventory_destination,
      this.inventoryOperationDescriptions.map((inventoryOperationDescription: InventoryOperationDescriptionObjectValue) => {
        const {
          id_product_operation_description,
          price_at_moment,
          cost_at_moment,
          quantity,
          created_at,
          id_inventory_operation,
          id_product,
        } = inventoryOperationDescription;
        return new InventoryOperationDescriptionObjectValue(
          id_product_operation_description,
          price_at_moment,
          cost_at_moment,
          quantity,
          created_at,
          id_inventory_operation,
          id_product,
        );
      }),
      document_reference,
    );
  }

  getAffectedInventoryBalanceRecords(): InventoryBalanceObjectValue[] {
    const affecetInventoryBalanceRecord: InventoryBalanceObjectValue[] = [];
    if(!this.isSpecialInventory(this.originInventory)) affecetInventoryBalanceRecord.push(...this.getAffectedInventoryBalanceRecordsFromInventoryBalance(this.originInventoryBalance));
    if(!this.isSpecialInventory(this.targetInventory)) affecetInventoryBalanceRecord.push(...this.getAffectedInventoryBalanceRecordsFromInventoryBalance(this.targetInventoryBalance));
    return affecetInventoryBalanceRecord;
  }

  private getAffectedInventoryBalanceRecordsFromInventoryBalance(_inventoryBalanceMap: Map<string, InventoryBalanceObjectValue>): InventoryBalanceObjectValue[] {
    const affectedInventoryBalance: InventoryBalanceObjectValue[] = [];
    for (const idProductWithMovement of this.productInInventoryOperationDescriptionSet) {
      affectedInventoryBalance.push(_inventoryBalanceMap.get(idProductWithMovement)!);
    }
    return affectedInventoryBalance;
  }

  private assertionInventoryInvolvedActive(): void {
    if (!this.isInventoryActive(this.originInventory)) throw new BusinessRuleException(`You cannot create an inventory operation to a deactived inventory; The origin inventory with id ${this.originInventory.id_inventory} is deactive.`);
    if (!this.isInventoryActive(this.targetInventory)) throw new BusinessRuleException(`You cannot create an inventory operation to a deactived inventory; The target inventory with id ${this.targetInventory.id_inventory} is deactive.`);
  }
  
  private assertionOriginInventoryAndTargetInventoryAreNotTheSame(): void {
    if (this.originInventory.id_inventory === this.targetInventory.id_inventory) throw new BusinessRuleException(`You cannot perform an inventory operation to the same inventory operation.`);
  }

  private isInventoryActive(_inventory: InventoryEntity): boolean {
    if (_inventory.is_active === INVENTORY_STATE_ENUM.ACTIVE) return true
    else return false
  }

  private isInventoryOperationInitialized(): void {
    if (this.inventoryOperation === null) throw new BusinessRuleException(`You cannot use an inventory operation if it has not been initialized.`)
  }

  private isSpecialInventory(inventory: InventoryEntity): boolean {
    /*
      These are special inventories because they are used as entities or inventories that might have 
      product movement but without necessarily have an inventory balance; they are used as pools.

      Particularity of these inventories:
      - They are unique across the system.
      - They are abstractions of more complex processes that are not practical to represent.
        Example: 
        * Inventory supplier can be represented as an inventory with raw materials as input and 
        prodcuts as products (input for other inventories) but this will imply in create a module or submodel for 
        manufacturing
        * Client virtual can be replaced creating an inventory for each client, but this will become impractical since we 
        are going to need to maintain each inventory (and there is not extra benefit that we can get maintaing this instead 
        of just calculating using the inventory descriptions).
      - By default, this inventory are infinite.
    */
    const { inventory_context } = inventory;

    return (
       inventory_context === INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL
    || inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL
    || inventory_context === INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL
    || inventory_context === INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL
    )
  }
}