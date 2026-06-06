import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity'
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum'
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum'

export const WASTED_VIRTUAL_INVENTORY = new InventoryEntity(
	'd2673e48-cb64-43ff-8f95-f0a7f86fc6c5',
	INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL,
	'WASTED_VIRTUAL_INVENTORY',
	INVENTORY_STATE_ENUM.ACTIVE,
	new Date(),
	new Date(),
	'f228a6e5-b427-4c0e-91d8-f4bebed80469',
	[],
	'',
	'',
)
