// Libraries
import { Injectable } from '@nestjs/common';

// Repositories
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

// Object value
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';

//Entities
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';

// Models
import { InventoryBalanceModel } from '@/src/inventories/application/models/inventory-balance.model';
import { InventoryModel } from '@/src/inventories/application/models/inventory.model';
import { InventoryOperationDescriptionModel } from '@/src/inventories/application/models/inventory-operation-description.model';
import { InventoryOperationModel } from '@/src/inventories/application/models/inventory-operation.model';

// Mappers
import { EntityModelMapper } from '@/src/inventories/application/mappers/entity-model.mapper';

// Shared
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

@Injectable()
export class InventorySupabaseRepository implements Inventory {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: EntityModelMapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async CreateInventory(inventory: InventoryEntity): Promise<void> {
    try {
      const inventoryModel = this.mapper.toModel(inventory);
      const { error } = await this.supabase.from('inventories').insert(inventoryModel);

      if (error) {
        throw new Error(`Failed to create inventory: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to create inventory: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async UpdateInventory(inventory: InventoryEntity): Promise<void> {
    try {
      const inventoryModel = this.mapper.toModel(inventory);

      const { error } = await this.supabase
        .from('inventories')
        .update({
          inventory_context: inventoryModel.inventory_context,
          inventory_name: inventoryModel.inventory_name,
          is_active: inventoryModel.is_active,
          updated_at: inventoryModel.updated_at,
          created_by: inventoryModel.created_by,
          assigned_facility: inventoryModel.assigned_facility,
          assigned_to: inventoryModel.assigned_to,
        })
        .eq('id_inventory', inventoryModel.id_inventory);

      if (error) {
        throw new Error(`Failed to update inventory: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to update inventory: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async CreateInventoryOperation(inventoryOperation: InventoryOperationEntity): Promise<void> {
    try {
      const operationModel = this.mapper.toModel(inventoryOperation);

      const { error } = await this.supabase.from('inventory_operations').insert(operationModel);

      if (error) {
        throw new Error(`Failed to create inventory operation: ${error.message}`);
      }

      if (inventoryOperation.inventory_operation_descriptions.length > 0) {
        const descriptions = inventoryOperation.inventory_operation_descriptions.map((description) =>
          this.mapper.toModel(description),
        );

        const { error: descriptionError } = await this.supabase
          .from('inventory_operation_descriptions')
          .insert(descriptions);

        if (descriptionError) {
          throw new Error(
            `Failed to create inventory operation descriptions: ${descriptionError.message}`,
          );
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to create inventory operation: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async UpsertInventoryBalance(inventoryBalance: InventoryBalanceObjectValue): Promise<void> {
    try {
      const inventoryBalanceModel = this.mapper.toModel(inventoryBalance);
      const { error } = await this.supabase
        .from('inventories_balance')
        .upsert(inventoryBalanceModel, { onConflict: 'id_inventory_balance' });

      if (error) {
        throw new Error(`Failed to upsert inventory balance: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to upsert inventory balance: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listInventoryOperations(
    limit: number,
    lastCreatedAt?: string,
    lastIdInventoryOperation?: string,
    inventory_operation_reference?: string[],
    movement_type?: number[],
    document_reference?: string[],
    created_by?: string[],
    id_inventory_origin?: string[],
    id_inventory_target?: string[],
  ): Promise<InventoryOperationEntity[]> {
    try {
      const query = this.supabase.from('inventory_operations').select('*');

      if (inventory_operation_reference && inventory_operation_reference.length > 0) {
        query.in('inventory_operation_reference', inventory_operation_reference);
      }
      if (movement_type && movement_type.length > 0) {
        query.in('movement_type', movement_type);
      }
      if (document_reference && document_reference.length > 0) {
        query.in('document_reference', document_reference);
      }
      if (created_by && created_by.length > 0) {
        query.in('created_by', created_by);
      }
      if (id_inventory_origin && id_inventory_origin.length > 0) {
        query.in('id_inventory_origin', id_inventory_origin);
      }
      if (id_inventory_target && id_inventory_target.length > 0) {
        query.in('id_inventory_target', id_inventory_target);
      }

      if (lastCreatedAt && lastIdInventoryOperation) {
        query.or(
          `created_at.lt."${lastCreatedAt}",and(created_at.eq."${lastCreatedAt}",id_inventory_operation.lt."${lastIdInventoryOperation}")`,
        );
      }

      query.order('created_at', { ascending: false });
      query.order('id_inventory_operation', { ascending: false });
      query.limit(limit);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list inventory operations: ${error.message}`);
      }

      return this.composeInventoryOperations(data as InventoryOperationModel[]);
    } catch (error) {
      throw new Error(
        `Failed to list inventory operations: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveInventoryOperations(idInventoryOperations: string[]): Promise<InventoryOperationEntity[]> {
    try {
      if (idInventoryOperations.length === 0) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('inventory_operations')
        .select('*')
        .in('id_inventory_operation', idInventoryOperations);

      if (error) {
        throw new Error(`Failed to retrieve inventory operations: ${error.message}`);
      }

      return this.composeInventoryOperations(data as InventoryOperationModel[]);
    } catch (error) {
      throw new Error(
        `Failed to retrieve inventory operations: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listInventories(
    limit: number,
    lastCreatedAt?: string,
    lastIdInventory?: string,
    inventory_context?: number[],
    inventory_name?: string[],
    is_active?: number[],
    created_by?: string[],
    assigned_to?: string[],
    assigned_facility?: string[],
  ): Promise<InventoryEntity[]> {
    try {
      const query = this.supabase.from('inventories').select('*');

      if (inventory_context && inventory_context.length > 0) {
        query.in('inventory_context', inventory_context);
      }
      if (inventory_name && inventory_name.length > 0) {
        query.in('inventory_name', inventory_name);
      }
      if (is_active && is_active.length > 0) {
        query.in('is_active', is_active);
      }
      if (created_by && created_by.length > 0) {
        query.in('created_by', created_by);
      }
      if (assigned_to && assigned_to.length > 0) {
        query.in('assigned_to', assigned_to);
      }
      if (assigned_facility && assigned_facility.length > 0) {
        query.in('assigned_facility', assigned_facility);
      }

      if (lastCreatedAt && lastIdInventory) {
        query.or(
          `created_at.lt."${lastCreatedAt}",and(created_at.eq."${lastCreatedAt}",id_inventory.lt."${lastIdInventory}")`,
        );
      }

      query.order('created_at', { ascending: false });
      query.order('id_inventory', { ascending: false });
      query.limit(limit);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list inventories: ${error.message}`);
      }

      return this.composeInventories(data as InventoryModel[]);
    } catch (error) {
      throw new Error(
        `Failed to list inventories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveInventories(idInventories: string[]): Promise<InventoryEntity[]> {
    try {
      if (idInventories.length === 0) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('inventories')
        .select('*')
        .in('id_inventory', idInventories);

      if (error) {
        throw new Error(`Failed to retrieve inventories: ${error.message}`);
      }

      return this.composeInventories(data as InventoryModel[]);
    } catch (error) {
      throw new Error(
        `Failed to retrieve inventories: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async composeInventories(inventoryModels: InventoryModel[]): Promise<InventoryEntity[]> {
    if (inventoryModels.length === 0) {
      return [];
    }

    const inventoryIds = inventoryModels.map((inventoryModel) => inventoryModel.id_inventory);

    const inventoryBalanceByInventoryId = await this.retrieveInventoryBalanceByInventoryId(inventoryIds);

    return inventoryModels.map((inventoryModel) =>
      this.mapper.toDomainObject(
        inventoryModel,
        inventoryBalanceByInventoryId.get(inventoryModel.id_inventory) ?? [],
      ),
    );
  }

  private async composeInventoryOperations(
    operationModels: InventoryOperationModel[],
  ): Promise<InventoryOperationEntity[]> {
    if (operationModels.length === 0) {
      return [];
    }

    const operationIds = operationModels.map((operationModel) => operationModel.id_inventory_operation);

    const descriptionsByOperationId =
      await this.retrieveInventoryOperationDescriptionByOperationId(operationIds);

    return operationModels.map((operationModel) =>
      this.mapper.toDomainObject(
        operationModel,
        descriptionsByOperationId.get(operationModel.id_inventory_operation) ?? [],
      ),
    );
  }

  private async retrieveInventoryBalanceByInventoryId(
    idInventories: string[],
  ): Promise<Map<string, InventoryBalanceModel[]>> {
    const map = new Map<string, InventoryBalanceModel[]>();

    if (idInventories.length === 0) {
      return map;
    }

    const { data, error } = await this.supabase
      .from('inventories_balance')
      .select('*')
      .in('id_inventory', idInventories);

    if (error) {
      throw new Error(`Failed to retrieve inventory balances: ${error.message}`);
    }

    for (const model of data as InventoryBalanceModel[]) {
      const list = map.get(model.id_inventory) ?? [];
      list.push(model);
      map.set(model.id_inventory, list);
    }

    return map;
  }

  private async retrieveInventoryOperationDescriptionByOperationId(
    idInventoryOperations: string[],
  ): Promise<Map<string, InventoryOperationDescriptionModel[]>> {
    const map = new Map<string, InventoryOperationDescriptionModel[]>();

    if (idInventoryOperations.length === 0) {
      return map;
    }

    const { data, error } = await this.supabase
      .from('inventory_operation_descriptions')
      .select('*')
      .in('id_inventory_operation', idInventoryOperations);

    if (error) {
      throw new Error(`Failed to retrieve inventory operation descriptions: ${error.message}`);
    }

    for (const model of data as InventoryOperationDescriptionModel[]) {
      const list = map.get(model.id_inventory_operation) ?? [];
      list.push(model);
      map.set(model.id_inventory_operation, list);
    }

    return map;
  }


  private toNumber(value: number | string, fieldName: string): number {
    const parsed = typeof value === 'number' ? value : Number(value);

    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid ${fieldName} format`);
    }

    return parsed;
  }

  private toDate(value: Date | string, fieldName: string): Date {
    const parsed = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid ${fieldName} format`);
    }

    return parsed;
  }
}
