import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';

export interface InventoryOperationModel {
  id_inventory_operation: string;
  latitude: string | null;
  longitude: string | null;
  inventory_operation_referenced?: string;
  movement_type: MOVEMENT_TYPE_ENUM;
  document_reference?: string;
  created_at: Date;
  created_by: string;
  id_inventory_origin: string;
  id_inventory_target: string;
}