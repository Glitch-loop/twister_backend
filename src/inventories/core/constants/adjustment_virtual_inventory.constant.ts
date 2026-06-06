import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity'
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum'
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum'

export const ADJUSTMENT_VIRTUAL_INVENTORY = new InventoryEntity(
	'c450ed76-7845-4c9e-9c21-8600f617ec2b',
	INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL,
	'ADJUSTMENT_VIRTUAL_INVENTORY',
	INVENTORY_STATE_ENUM.ACTIVE,
	new Date(),
	new Date(),
	'f228a6e5-b427-4c0e-91d8-f4bebed80469',
	[],
	'',
	'',
)
