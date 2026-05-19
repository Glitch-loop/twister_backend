// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { BusinessOperationRouteController } from '@/src/business-operation-route/business-operation-route.controller';

@Module({
  controllers: [BusinessOperationRouteController],
  providers: [],
})
export class BusinessOperationRouteModule {}
