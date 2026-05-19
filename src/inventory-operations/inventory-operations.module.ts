// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { InventoryOperationsController } from '@/src/inventory-operations/inventory-operations.controller';

@Module({
  controllers: [InventoryOperationsController],
  providers: [],
})
export class InventoryOperationsModule {}
