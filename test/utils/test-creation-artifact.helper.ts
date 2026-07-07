import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { FacilityModel } from '@/src/inventories/application/models/facility.model';
import { FacilityTypeModel } from '@/src/inventories/application/models/facility-type.model';
import { InventoryBalanceModel } from '@/src/inventories/application/models/inventory-balance.model';
import { InventoryModel } from '@/src/inventories/application/models/inventory.model';
import { InventoryOperationDescriptionModel } from '@/src/inventories/application/models/inventory-operation-description.model';
import { InventoryOperationModel } from '@/src/inventories/application/models/inventory-operation.model';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';
import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';
import { IntegrityNodeRepository } from '@/src/shared/infrastructure/repositories/node/integrity.repository';
import { UserModel } from '@/src/users/application/models/user.model';
import { ProductModel } from '@/src/products/application/models/product.model';
// Inventories module
type InventoryOverrides = Partial<InventoryEntity> & {
  inventory_balance?: InventoryBalanceObjectValue[];
};
type BalanceOverrides = Partial<InventoryBalanceObjectValue>;
type OperationDescriptionOverrides = Partial<InventoryOperationDescriptionObjectValue>;
type OperationOverrides = Partial<InventoryOperationEntity> & {
  inventory_operation_descriptions?: InventoryOperationDescriptionObjectValue[];
};
type InventoryModelOverrides = Partial<InventoryModel>;
type InventoryBalanceModelOverrides = Partial<InventoryBalanceModel>;
type InventoryOperationModelOverrides = Partial<InventoryOperationModel>;
type InventoryOperationDescriptionModelOverrides = Partial<InventoryOperationDescriptionModel>;
type FacilityModelOverrides = Partial<FacilityModel>;
type FacilityTypeModelOverrides = Partial<FacilityTypeModel>;
type ProductModelOverrides = Partial<ProductModel>;

// Products module
type ProductOverrides = Partial<ProductEntity> & {
  product_price?: ProductPriceObjectValue[];
};


// Users module
type UserModelOverrides = Partial<UserModel>;

const integrityNode: IntegrityNodeRepository = new IntegrityNodeRepository();

export function createInventoryBalance(
  overrides: BalanceOverrides = {},
): InventoryBalanceObjectValue {
  
  return new InventoryBalanceObjectValue(
    overrides.id_inventory_balance ?? integrityNode.generateUUIDv4(),
    overrides.quantity ?? 10,
    overrides.min_quantity ?? null,
    overrides.max_quantity ?? null,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2026-07-01T01:00:00.000Z'),
    overrides.id_inventory ?? integrityNode.generateUUIDv4(),
    overrides.id_product ?? integrityNode.generateUUIDv4(),
  );
}

export function createInventoryEntity(
  overrides: InventoryOverrides = {},
): InventoryEntity {
  let id_facility: null | string = null;
  let id_user: null | string = null;

  if (overrides.assigned_facility === null) {
    id_facility = null;
  } else if (overrides.assigned_facility === undefined) {
    id_facility = integrityNode.generateUUIDv4();
  } else {
    id_facility = overrides.assigned_facility;
  }

  if (overrides.assigned_to === null) {
    id_user = null;
  } else if (overrides.assigned_facility === undefined) {
    id_user = integrityNode.generateUUIDv4();
  } else {
    id_user = overrides.assigned_facility;
  }
  return new InventoryEntity(
    overrides.id_inventory ?? integrityNode.generateUUIDv4(),
    overrides.inventory_context ?? INVENTORY_CONTEXT_ENUM.WAREHOUSE,
    overrides.inventory_name ?? 'Main warehouse',
    overrides.is_active ?? INVENTORY_STATE_ENUM.ACTIVE,
    overrides.stock_validation ?? STOCK_VALIDATION_ENUM.ENABLE,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2026-07-01T01:00:00.000Z'),
    overrides.created_by ?? integrityNode.generateUUIDv4(),
    overrides.inventory_balance ?? [],
    id_facility,
    id_user,
  );
}

export function createInventoryOperationDescription(
  overrides: OperationDescriptionOverrides = {},
): InventoryOperationDescriptionObjectValue {
  return new InventoryOperationDescriptionObjectValue(
    overrides.id_inventory_operation_description ?? integrityNode.generateUUIDv4(),
    overrides.price_at_moment ?? 12.5,
    overrides.cost_at_moment ?? 10.1,
    overrides.quantity ?? 2,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.id_inventory_operation ?? integrityNode.generateUUIDv4(),
    overrides.id_product ?? integrityNode.generateUUIDv4(),
  );
}

export function createInventoryOperationEntity(
  overrides: OperationOverrides = {},
): InventoryOperationEntity {
  return new InventoryOperationEntity(
    overrides.id_inventory_operation ?? integrityNode.generateUUIDv4(),
    overrides.latitude ?? null,
    overrides.longitude ?? null,
    overrides.movement_type ?? MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.created_by ?? integrityNode.generateUUIDv4(),
    overrides.id_inventory_origin ?? integrityNode.generateUUIDv4(),
    overrides.id_inventory_target ?? integrityNode.generateUUIDv4(),
    overrides.inventory_operation_descriptions ?? [createInventoryOperationDescription()],
    overrides.inventory_operation_reference ?? null,
    overrides.document_reference ?? null,
  );
}

export function createInventoryModel(
  overrides: InventoryModelOverrides = {},
): InventoryModel {
  return {
    id_inventory: overrides.id_inventory ?? integrityNode.generateUUIDv4(),
    inventory_context: overrides.inventory_context ?? INVENTORY_CONTEXT_ENUM.WAREHOUSE,
    inventory_name: overrides.inventory_name ?? 'Main warehouse' + new Date().toISOString(),
    is_active: overrides.is_active ?? INVENTORY_STATE_ENUM.ACTIVE,
    stock_validation: overrides.stock_validation ?? STOCK_VALIDATION_ENUM.ENABLE,
    created_at: overrides.created_at ?? '2026-07-01T00:00:00.000Z',
    updated_at: overrides.updated_at ?? '2026-07-01T01:00:00.000Z',
    created_by: overrides.created_by ?? integrityNode.generateUUIDv4(),
    assigned_to: overrides.assigned_to ?? null,
    assigned_facility: overrides.assigned_facility ?? integrityNode.generateUUIDv4(),
  };
}

export function createInventoryBalanceModel(
  overrides: InventoryBalanceModelOverrides = {},
): InventoryBalanceModel {
  return {
    id_inventory_balance: overrides.id_inventory_balance ?? integrityNode.generateUUIDv4(),
    quantity: overrides.quantity ?? 10,
    min_quantity: overrides.min_quantity ?? null,
    max_quantity: overrides.max_quantity ?? null,
    created_at: overrides.created_at ?? '2026-07-01T00:00:00.000Z',
    updated_at: overrides.updated_at ?? '2026-07-01T01:00:00.000Z',
    id_inventory: overrides.id_inventory ?? integrityNode.generateUUIDv4(),
    id_product: overrides.id_product ?? integrityNode.generateUUIDv4(),
  };
}

export function createInventoryOperationModel(
  overrides: InventoryOperationModelOverrides = {},
): InventoryOperationModel {
  return {
    id_inventory_operation: overrides.id_inventory_operation ?? integrityNode.generateUUIDv4(),
    movement_type: overrides.movement_type ?? MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
    created_at: overrides.created_at ?? '2026-07-01T00:00:00.000Z',
    created_by: overrides.created_by ?? integrityNode.generateUUIDv4(),
    id_inventory_origin: overrides.id_inventory_origin ?? integrityNode.generateUUIDv4(),
    id_inventory_target: overrides.id_inventory_target ?? integrityNode.generateUUIDv4(),
    latitude: overrides.latitude ?? null,
    longitude: overrides.longitude ?? null,
    inventory_operation_reference: overrides.inventory_operation_reference ?? null,
    document_reference: overrides.document_reference ?? null,
  };
}

export function createInventoryOperationDescriptionModel(
  overrides: InventoryOperationDescriptionModelOverrides = {},
): InventoryOperationDescriptionModel {
  return {
    id_inventory_operation_description:
      overrides.id_inventory_operation_description ?? integrityNode.generateUUIDv4(),
    price_at_moment: overrides.price_at_moment ?? 12.5,
    cost_at_moment: overrides.cost_at_moment ?? 10.1,
    quantity: overrides.quantity ?? 2,
    created_at: overrides.created_at ?? '2026-07-01T00:00:00.000Z',
    id_inventory_operation: overrides.id_inventory_operation ?? integrityNode.generateUUIDv4(),
    id_product: overrides.id_product ?? integrityNode.generateUUIDv4(),
  };
}

export function createFacilityTypeModel(
  overrides: FacilityTypeModelOverrides = {},
): FacilityTypeModel {
  return {
    id_facility_type: overrides.id_facility_type ?? integrityNode.generateUUIDv4(),
    facility_type_name: overrides.facility_type_name ?? 'Warehouse',
    created_at: overrides.created_at ?? '2026-07-01T00:00:00.000Z',
  };
}

export function createFacilityModel(
  overrides: FacilityModelOverrides = {},
): FacilityModel {
  return {
    id_facility: overrides.id_facility ?? integrityNode.generateUUIDv4(),
    street: overrides.street ?? 'Main St',
    ext_number: overrides.ext_number ?? '100',
    colony: overrides.colony ?? 'Downtown',
    postal_code: overrides.postal_code ?? '00000',
    facility_name: overrides.facility_name ?? 'Main facility',
    latitude: overrides.latitude ?? '19.4326',
    longitude: overrides.longitude ?? '-99.1332',
    is_active: overrides.is_active ?? 1,
    id_facility_type: overrides.id_facility_type ?? integrityNode.generateUUIDv4(),
  };
}

export function createProductEntity(
  overrides: ProductOverrides = {},
): ProductEntity {
  return new ProductEntity(
    overrides.id_product ?? integrityNode.generateUUIDv4(),
    overrides.product_name ?? integrityNode.generateUUIDv4(),
    overrides.cost ?? 10,
    overrides.product_status ?? PRODUCT_STATUS_ENUM.ACTIVE,
    overrides.quantity_presentation ?? 1,
    overrides.order_to_show ?? 1,
    overrides.id_measurement_unit ?? integrityNode.generateUUIDv4(),
    overrides.product_price ?? [new ProductPriceObjectValue('price-1', 15, new Date('2026-07-01T00:00:00.000Z'))],
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.barcode,
  );
}

export function createUserModel(
  overrides: UserModelOverrides = {},
): UserModel {
  return {
    id_user: overrides.id_user ?? integrityNode.generateUUIDv4(),
    cellphone: overrides.cellphone ?? '5512345678',
    name: overrides.name ?? 'Test User',
    password: overrides.password ?? 'password',
    status: overrides.status ?? 1,
    salary: overrides.salary ?? 100,
    created_at: overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    updated_at: overrides.updated_at ?? new Date('2026-07-01T01:00:00.000Z'),
    address: overrides.address,
    rfc: overrides.rfc,
    imss: overrides.imss,
  };
}


export function createProductModel (
  overrides: ProductModelOverrides = {},
) : ProductModel {
  return {
    id_product: overrides.id_product ?? integrityNode.generateUUIDv4(),
    product_name: overrides.product_name ?? 'Test product' + new Date().toISOString(),
    barcode: overrides.barcode ?? '123456',
    cost: overrides.cost ?? 9.99,
    product_status: overrides.product_status ?? 1,
    quantity_presentation: overrides.product_status ?? 100,
    order_to_show: overrides.product_status ?? 99,
    id_measurement_unit: overrides.id_measurement_unit ?? integrityNode.generateUUIDv4(),
    created_at: new Date('2026-07-01T01:00:00.000Z'),
  }
}