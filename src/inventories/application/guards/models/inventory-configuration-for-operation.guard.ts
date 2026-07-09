// Models
import type { InventoryConfigurationForOperationModel } from "@/src/inventories/application/models/inventory-configuration-for-operation.model";

// Utils
import { isRecord } from "@/src/shared/application/guards/utils";

export const isInventoryConfigurationForOperationModel = (value: unknown): value is InventoryConfigurationForOperationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_configuration === "string" &&
    typeof value.created_at === "string" &&
    typeof value.inventory_operation_type === "string" &&
    typeof value.origin_inventory === "string" &&
    typeof value.target_inventory === "string" &&
    typeof value.created_by === "string" &&
    (value.user_assigned_to === null || typeof value.user_assigned_to === "string") &&
    (value.facility_assigned_to === null || typeof value.facility_assigned_to === "string")
  )
}