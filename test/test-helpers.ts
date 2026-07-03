import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
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

type InventoryOverrides = Partial<InventoryEntity> & {
  inventory_balance?: InventoryBalanceObjectValue[];
};

type BalanceOverrides = Partial<InventoryBalanceObjectValue>;
type OperationDescriptionOverrides = Partial<InventoryOperationDescriptionObjectValue>;
type OperationOverrides = Partial<InventoryOperationEntity> & {
  inventory_operation_descriptions?: InventoryOperationDescriptionObjectValue[];
};
type ProductOverrides = Partial<ProductEntity> & {
  product_price?: ProductPriceObjectValue[];
};

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
    overrides.assigned_facility ?? integrityNode.generateUUIDv4(),
    overrides.assigned_to ?? integrityNode.generateUUIDv4(),
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
