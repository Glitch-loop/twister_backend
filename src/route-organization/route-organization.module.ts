// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { RouteOrganizationController } from '@/src/route-organization/route-organization.controller';

@Module({
  controllers: [RouteOrganizationController],
  providers: [],
})
export class RouteOrganizationModule {}