import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

export class InventoryOperationEntity {
	constructor(
		public readonly id_inventory_operation: string,
		public readonly latitude: string | null,
		public readonly longitude: string | null,
		public readonly movement_type: MOVEMENT_TYPE_ENUM,
		public readonly created_at: Date,
		public readonly created_by: string,
		public readonly id_inventory_origin: string,
		public readonly id_inventory_target: string,
		public readonly inventory_operation_descriptions: InventoryOperationDescriptionObjectValue[],
		public readonly inventory_operation_reference: string | null,
		public readonly document_reference: string | null,
	) {}
}
