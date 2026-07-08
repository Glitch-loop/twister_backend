// Entities
import { InventoryConfigurationForOperationEntity } from "@/src/inventories/core/entities/inventory-configuration-for-operation.entity";

// Utils
import { isRecord } from "@/src/shared/application/guards/utils";

export const isInventoryConfigurationForOperationModel = (value: unknown): value is InventoryConfigurationForOperationEntity => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_configuration === "string" &&
    typeof value.inventory_operation === "string" &&
    typeof value.origin_inventory === "string" &&
    typeof value.target_inventory === "string" &&
    value.created_at instanceof Date &&
    typeof value.user_assigned_to === "string" &&
    typeof value.facility_assigned_to === "string"
  )
}