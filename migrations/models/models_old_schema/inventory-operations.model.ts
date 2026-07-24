export class InventoryOperationsModel {
  constructor(
    public readonly sign_confirmation: string,
    public readonly date: string,
    public readonly audit: number,
    public readonly id_inventory_operation: string,
    public readonly id_inventory_operation_type: string,
    public readonly id_work_day: string,
    public readonly state: number,
  ) {}
}
