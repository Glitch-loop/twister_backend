import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';

export class InventoryEntity {
	constructor(
		public readonly id_inventory: string,
		public readonly inventory_context: INVENTORY_CONTEXT_ENUM,
		public readonly inventory_name: string,
		public readonly is_active: INVENTORY_STATE_ENUM,
		public readonly created_at: Date,
		public readonly updated_at: Date,
		public readonly created_by: string,
		public readonly inventory_balance: InventoryBalanceObjectValue[],
		public readonly assigned_facility: string | null,
		public readonly assigned_to: string | null,
	) {}

	public isForbiddenInventory():boolean { 
    if (this.inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL
    || this.inventory_context === INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL
    || this.inventory_context === INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL
    || this.inventory_context === INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL
    ) {
      return true;
    } else {
      return false;
    }
  }
}
