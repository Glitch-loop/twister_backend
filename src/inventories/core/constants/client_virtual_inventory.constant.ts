import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity'
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum'
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum'

export const CLIENT_VIRTUAL_INVENTORY = new InventoryEntity(
	'041c6093-a97b-4f4c-ab8e-6d1e35689555',
	INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
	'CLIENT_VIRTUAL_INVENTORY',
	INVENTORY_STATE_ENUM.ACTIVE,
	new Date(),
	new Date(),
	'f228a6e5-b427-4c0e-91d8-f4bebed80469',
	[],
	null,
	null,
)
