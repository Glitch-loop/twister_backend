// Enums
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum'
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum'
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum'

// Entities
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity'

/*
	Note (07-06-26):
	Stock validation are by defualt disables since special (or virtuals) inventories 
	has not inventory balance
*/

export const CLIENT_VIRTUAL_INVENTORY = new InventoryEntity(
	'041c6093-a97b-4f4c-ab8e-6d1e35689555',
	INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
	'CLIENT_VIRTUAL_INVENTORY',
	INVENTORY_STATE_ENUM.ACTIVE,
	STOCK_VALIDATION_ENUM.DISABLE,
	new Date(),
	new Date(),
	'f228a6e5-b427-4c0e-91d8-f4bebed80469',
	[],
	null,
	null,
)
