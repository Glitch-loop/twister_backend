export interface InventoryOperationModel {
  id_inventory_operation: string;
  sign_confirmation: string;
  date: Date;
  audit: number;
  id_inventory_operation_type: string;
  id_work_day: string;
  state: number;
}
