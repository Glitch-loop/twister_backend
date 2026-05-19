// Libraries
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { AppController } from '@/src/app.controller';

// Services
import { AppService } from '@/src/app.service';

// Modules
import { UsersModule } from '@/src/users/users.module';
import { ClientsModule } from '@/src/clients/clients.module';
import { RouteOrganizationModule } from '@/src/route-organization/route-organization.module';
import { BusinessOperationRouteModule } from '@/src/business-operation-route/business-operation-route.module';
import { InventoryOperationsModule } from '@/src/inventory-operations/inventory-operations.module';
import { ProductsModule } from '@/src/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    UsersModule,
    ClientsModule,
    RouteOrganizationModule,
    BusinessOperationRouteModule,
    InventoryOperationsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
