// Libraries
import { Module } from '@nestjs/common';

// Commands
import { CreateInventoryCommand } from '@/src/inventories/application/commands/create-inventory.command';
import { DeactiveInventoryCommand } from '@/src/inventories/application/commands/deactive-inventory.command';
import { RegisterInventoryAdjustmentCommand } from '@/src/inventories/application/commands/register-inventory-adjustment.command';
import { RegisterInventoryOperationForTransactionCommand } from '@/src/inventories/application/commands/register-inventory-operation-for-transaction.command';
import { RegisterInventoryOperationBetweenInventoriesCommand } from '@/src/inventories/application/commands/register-inventory-operation-between-inventories.command';
import { RegisterProductDevolutionCommand } from '@/src/inventories/application/commands/register-product-devolution.command';
import { RegisterSupplierReciptCommand } from '@/src/inventories/application/commands/register-supplier-recipt.command';
import { RegisterWasteInventoryOperationCommand } from '@/src/inventories/application/commands/register-waste-inventory-operation.command';
import { ReverseInventoryMovementCommand } from '@/src/inventories/application/commands/reverse-inventory-movement.command';
import { UpdateInventoryCommand } from '@/src/inventories/application/commands/update-inventory.command';
import { RegisterRouteInventoryOperationCommand } from '@/src/inventories/application/commands/register-route-inventory-operation.command';

// Queries
import { ListInventoriesQuery } from '@/src/inventories/application/queries/list-inventories.query';
import { ListInventoryOperationsQuery } from '@/src/inventories/application/queries/list-inventory-operations.query';
import { RetrieveInventoriesByIdInventoryQuery } from '@/src/inventories/application/queries/retrieve-inventories-by-id-inventory.query';
import { RetrieveInventoryOperationsByIdInventoryOperationQuery } from '@/src/inventories/application/queries/retrieve-inventory-operations-by-id-inventory-operation.query';

// Mappers
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { EntityModelMapper } from '@/src/inventories/application/mappers/entity-model.mapper';

// Interfaces
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import { InventorySupabaseRepository } from '@/src/inventories/infrastructure/repositories/supabase/inventory-supabase.repository';

//Controllers
import { InventoriesController } from '@/src/inventories/inventories.controller';
import { RouteInventoryController } from '@/src/inventories/route-inventory.controller';

// Datasource
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Modules
import { ProductsModule } from '@/src/products/products.module';
import { SharedModule } from '@/src/shared/shared.module';
import { RegisterRouteTransactionListener } from './application/listeners/register-route-transaction.listener';
import { CancelRouteTransactionListener } from './application/listeners/cancel-route-transaction.listener';

@Module({
  imports: [SharedModule, ProductsModule],
  controllers: [InventoriesController, RouteInventoryController],
  providers: [
    CreateInventoryCommand,
    UpdateInventoryCommand,
    DeactiveInventoryCommand,
    RegisterInventoryOperationForTransactionCommand,
    RegisterProductDevolutionCommand,
    RegisterInventoryOperationBetweenInventoriesCommand,
    RegisterInventoryAdjustmentCommand,
    RegisterSupplierReciptCommand,
    RegisterWasteInventoryOperationCommand,
    ReverseInventoryMovementCommand,
    RegisterRouteInventoryOperationCommand,
    ListInventoriesQuery,
    RetrieveInventoriesByIdInventoryQuery,
    ListInventoryOperationsQuery,
    RetrieveInventoryOperationsByIdInventoryOperationQuery,
    EntityDtoMapper,
    EntityModelMapper,
    SupabaseDataSource,
    InventorySupabaseRepository,
    {
      provide: InventoryRepository,
      useExisting: InventorySupabaseRepository,
    },
    RegisterRouteTransactionListener,
    CancelRouteTransactionListener
  ],
})
export class InventoriesModule {}
