export class InventoryOperationsModel {
  constructor(
    public readonly id_inventory_operation: string,
    public readonly document_reference: string | null,
    public readonly movement_type: number,
    public readonly latitude: string | null,
    public readonly longitude: string | null,
    public readonly inventory_operation_reference: string | null,
    public readonly created_by: string,
    public readonly id_inventory_origin: string,
    public readonly id_inventory_target: string,
    public readonly created_at: string,
  ) {}
}
