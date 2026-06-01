import { Module } from '@nestjs/common';

import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';
import { EntityModelMapper } from '@/src/sellings/application/mappers/entity-model.mapper';
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';
import { RouteTransactionsSupabaseRepository } from '@/src/sellings/infrastructure/infrastructure/repositories/supabase/route-transactions-supabase.repository';
import { SellingsController } from '@/src/sellings/sellings.controller';
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

@Module({
  controllers: [SellingsController],
  providers: [
    EntityDtoMapper,
    EntityModelMapper,
    SupabaseDataSource,
    RouteTransactionsSupabaseRepository,
    {
      provide: RouteTransactionRepository,
      useExisting: RouteTransactionsSupabaseRepository,
    },
  ],
})
export class SellingsModule {}
