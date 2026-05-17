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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    UsersModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
