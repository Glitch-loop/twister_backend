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

export function createInventoryBalance(
  overrides: BalanceOverrides = {},
): InventoryBalanceObjectValue {
  return new InventoryBalanceObjectValue(
    overrides.id_inventory_balance ?? 'balance-1',
    overrides.quantity ?? 10,
    overrides.min_quantity ?? null,
    overrides.max_quantity ?? null,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2026-07-01T01:00:00.000Z'),
    overrides.id_inventory ?? 'inv-1',
    overrides.id_product ?? 'prod-1',
  );
}

export function createInventoryEntity(
  overrides: InventoryOverrides = {},
): InventoryEntity {
  return new InventoryEntity(
    overrides.id_inventory ?? 'inv-1',
    overrides.inventory_context ?? INVENTORY_CONTEXT_ENUM.WAREHOUSE,
    overrides.inventory_name ?? 'Main warehouse',
    overrides.is_active ?? INVENTORY_STATE_ENUM.ACTIVE,
    overrides.stock_validation ?? STOCK_VALIDATION_ENUM.ENABLE,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2026-07-01T01:00:00.000Z'),
    overrides.created_by ?? 'user-1',
    overrides.inventory_balance ?? [],
    overrides.assigned_facility ?? 'facility-1',
    overrides.assigned_to ?? 'assigned-user-1',
  );
}

export function createInventoryOperationDescription(
  overrides: OperationDescriptionOverrides = {},
): InventoryOperationDescriptionObjectValue {
  return new InventoryOperationDescriptionObjectValue(
    overrides.id_inventory_operation_description ?? 'desc-1',
    overrides.price_at_moment ?? 12.5,
    overrides.cost_at_moment ?? 10.1,
    overrides.quantity ?? 2,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.id_inventory_operation ?? 'operation-1',
    overrides.id_product ?? 'prod-1',
  );
}

export function createInventoryOperationEntity(
  overrides: OperationOverrides = {},
): InventoryOperationEntity {
  return new InventoryOperationEntity(
    overrides.id_inventory_operation ?? 'operation-1',
    overrides.latitude ?? null,
    overrides.longitude ?? null,
    overrides.movement_type ?? MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.created_by ?? 'user-1',
    overrides.id_inventory_origin ?? 'inv-origin',
    overrides.id_inventory_target ?? 'inv-target',
    overrides.inventory_operation_descriptions ?? [createInventoryOperationDescription()],
    overrides.inventory_operation_reference ?? null,
    overrides.document_reference ?? null,
  );
}

export function createProductEntity(
  overrides: ProductOverrides = {},
): ProductEntity {
  return new ProductEntity(
    overrides.id_product ?? 'prod-1',
    overrides.product_name ?? 'Product 1',
    overrides.cost ?? 10,
    overrides.product_status ?? PRODUCT_STATUS_ENUM.ACTIVE,
    overrides.quantity_presentation ?? 1,
    overrides.order_to_show ?? 1,
    overrides.id_measurement_unit ?? 'measure-1',
    overrides.product_price ?? [new ProductPriceObjectValue('price-1', 15, new Date('2026-07-01T00:00:00.000Z'))],
    overrides.created_at ?? new Date('2026-07-01T00:00:00.000Z'),
    overrides.barcode,
  );
}
