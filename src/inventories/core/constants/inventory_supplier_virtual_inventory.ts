import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity'
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum'
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum'
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum'

/*
	Note (07-06-26):
	Stock validation are by defualt disables since special (or virtuals) inventories 
	has not inventory balance
*/

export const INVENTORY_SUPPLIER_VIRTUAL_INVENTORY = new InventoryEntity(
	'6999f7af-7d84-4f0b-8e3f-94a91358cf0e',
	INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL,
	'INVENTORY_SUPPLIER_VIRTUAL_INVENTORY',
	INVENTORY_STATE_ENUM.ACTIVE,
	STOCK_VALIDATION_ENUM.DISABLE,
	new Date(),
	new Date(),
	'f228a6e5-b427-4c0e-91d8-f4bebed80469',
	[],
	null,
	null,
)
