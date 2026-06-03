import { BusinessRuleException } from "@/src/shared/errors/BusinessRuleException";
import { InventoryEntity } from "../entities/inventory.entity";
import { MOVEMENT_TYPE_ENUM } from "../enums/movement-type.enum";
import { InventoryBalanceObjectValue } from "../value-objects/inventory-balance.object-value";
import { INVENTORY_STATE_ENUM } from "../enums/inventory-state-enum";
import { InventoryOperationEntity } from "../entities/inventory-operation.entity";
import { InventoryOperationDescriptionObjectValue } from "../value-objects/inventory-operation-description.object-value";
import { INVENTORY_CONTEXT_ENUM } from "../enums/inventory-context.enum";


export class InventoryOperationAggregate {
  private readonly originInventory: InventoryEntity;
  private readonly targetInventory: InventoryEntity;
  private readonly originInventoryBalance: InventoryBalanceObjectValue[];
  private readonly targetInventoryBalance: InventoryBalanceObjectValue[];
  private inventoryOperation: InventoryOperationEntity|null;
  private productDescriptions: InventoryOperationDescriptionObjectValue[];


  constructor(
    _originInventory: InventoryEntity,
    _targetInventory: InventoryEntity,
  ) {
    this.originInventory = this.cloneInventory(_originInventory);
    this.targetInventory = this.cloneInventory(_targetInventory);


    this.originInventoryBalance = this.cloneBalance(this.originInventory.inventory_balance)
    this.targetInventoryBalance = this.cloneBalance(this.targetInventory.inventory_balance)
    
    this.inventoryOperation = null;
    this.productDescriptions = [];
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
      this.cloneBalance(inventory.inventory_balance),
      inventory.assigned_facility,
      inventory.assigned_to,
    );
  }

  private cloneBalance(inventoryItems: InventoryBalanceObjectValue[]): InventoryBalanceObjectValue[] {
    const productInInventorySet:Set<string> = new Set<string>()
    for (const item of inventoryItems) {
      const { id_product, id_inventory } = item;
      if(productInInventorySet.has(id_product)) 
        throw new BusinessRuleException(`The product with id ${id_product} appears twice in inventory with if ${id_inventory}`);
      productInInventorySet.add(id_product)
    }

    return inventoryItems.map((balance) => {
      return new InventoryBalanceObjectValue(
        balance.id_inventory_balance,
        balance.quantity,
        new Date(balance.created_at),
        balance.id_inventory,
        balance.id_product,
      );
    })    

  }

  createInventoryOperationForTransaction (
    _idInventoryOperation: string,
    _movementType: MOVEMENT_TYPE_ENUM,
    _CreatedBy: string,
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
      new Date(),
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
      new Date(),
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
    _inventoryOperation: InventoryOperationEntity
  ) {
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();
    this.assertionInventoryInvolvedActive();

    const { id_inventory_operation, movement_type } = _inventoryOperation;

    if (movement_type === MOVEMENT_TYPE_ENUM.REVERSED) 
      throw new BusinessRuleException(`REVERSE (CANCEL) operation cannot be reversed (cancelled).`);

    if (_inventoryOperation === undefined) 
      throw new BusinessRuleException(`For creating a REVERSE inventory operation, you have to provide the id of the inventory operation to be reversed.`);

    this.inventoryOperation = new InventoryOperationEntity(
      _idInventoryOperation,
      _inventoryOperation.latitude,
      _inventoryOperation.longitude,
      MOVEMENT_TYPE_ENUM.REVERSED,
      new Date(),
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
      new Date(),
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
      new Date(),
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
      new Date(),
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
    _latitude?: string,
    _longitude?: string,
  ) {
    this.assertionInventoryInvolvedActive();
    this.assertionOriginInventoryAndTargetInventoryAreNotTheSame();

    if (!(this.originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.WAREHOUSE
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
      new Date(),
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
    _priceAtMoment: string,
    _costAtMoment: string,
    _quantity: string,
    _idProduct: string,
  ) {
    this.isInventoryOperationInitialized();

    InventoryOperationDescriptionObjectValue()
    
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
}