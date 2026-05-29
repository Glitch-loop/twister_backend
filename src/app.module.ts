// Libraries
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Controllers
import { AppController } from '@/src/app.controller';

// Services
import { AppService } from '@/src/app.service';

// Modules
import { UsersModule } from '@/src/users/users.module';
import { ClientsModule } from '@/src/clients/clients.module';
import { RouteOrganizationModule } from '@/src/route-organization/route-organization.module';
import { BusinessOperationRouteModule } from '@/src/business-operation-route/business-operation-route.module';
import { ProductsModule } from '@/src/products/products.module';

// Interceptor
import { HttpInterceptor } from '@/src/http.interceptor';

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
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor
    }
  ],
})
export class AppModule {}
