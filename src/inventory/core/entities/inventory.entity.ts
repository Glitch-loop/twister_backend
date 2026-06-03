import { INVENTORY_CONTEXT_ENUM } from '@/src/inventory/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventory/core/enums/inventory-state-enum';
import { InventoryBalanceObjectValue } from '@/src/inventory/core/value-objects/inventory-balance.object-value';

export class InventoryEntity {
	constructor(
		public readonly id_inventory: string,
		public readonly inventory_context: INVENTORY_CONTEXT_ENUM,
		public readonly inventory_name: string,
		public readonly is_active: INVENTORY_STATE_ENUM,
		public readonly updated_at: Date,
		public readonly created_at: Date,
		public readonly created_by: string,
		public readonly inventory_balance: InventoryBalanceObjectValue[],
		public readonly assigned_facility?: string,
		public readonly assigned_factory?: string,
	) {}
}
