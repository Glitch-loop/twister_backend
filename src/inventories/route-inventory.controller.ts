// Libraries
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// Dtos
import { RouteInventoryOperationDto } from '@/src/inventories/application/dtos/route-inventory-operation.dto';

// Enums
import { ROUTE_INVENTORY_OPERATION_TYPE } from '@/src/inventories/core/enums/route-inventory-operation-type.enum';

// Commands
import { RegisterRouteInventoryOperationCommand } from '@/src/inventories/application/commands/register-route-inventory-operation.command';

// Http
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';

@ApiTags('Route inventories')
@Controller('inventories/route')
export class RouteInventoryController {
  constructor(
    private readonly registerRouteInventoryOperationCommand: RegisterRouteInventoryOperationCommand
  ) {

  }

  @ApiOperation({
    summary: 'Register inventory operation',
    description: `Register a route inventory operation.
This endpoint was designed for syncing the vendor's inventory operations.

The inventory operation is created and registered in the database, in the same way,
the process determines to which inventories the operaion affects using the inventory
operation type applying the changes to the affected inventories.

Route inventory available:

- start_shift_inventory: ${ROUTE_INVENTORY_OPERATION_TYPE.start_shift_inventory}
- restock_inventory: ${ROUTE_INVENTORY_OPERATION_TYPE.restock_inventory}
- end_shift_inventory: ${ROUTE_INVENTORY_OPERATION_TYPE.end_shift_inventory}
- product_devolution_inventory: ${ROUTE_INVENTORY_OPERATION_TYPE.product_devolution_inventory}

`,
  })
  @ApiBody({ type: [ RouteInventoryOperationDto ] })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('')
  async createInventory(@Body() body: RouteInventoryOperationDto[]): Promise<httpControllerResponse> {
    for (const invOp of body) {
        await this.registerRouteInventoryOperationCommand.execute(
          invOp.id_inventory_operation,
          invOp.date,
          invOp.id_inventory_operation_type as ROUTE_INVENTORY_OPERATION_TYPE,
          invOp.id_user,
          invOp.inventory_operation_descriptions,
        );
    }

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Inventory operations registered successfully.');
  }
}