
export interface InventoryOperationModel {
  id_inventory_operation: string;
  movement_type: number;
  created_at: string;
  created_by: string;
  id_inventory_origin: string;
  id_inventory_target: string;
  latitude: string | null;
  longitude: string | null;
  inventory_operation_reference: string | null;
  document_reference: string | null;
}