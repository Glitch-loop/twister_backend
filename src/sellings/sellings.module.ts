import { Module } from '@nestjs/common';

import { CancelTransactionCommand } from '@/src/sellings/application/commands/cancel-transaction.command';
import { RegisterTransactionCommand } from '@/src/sellings/application/commands/register-transaction.command';
import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';
import { EntityModelMapper } from '@/src/sellings/application/mappers/entity-model.mapper';
import { ListTransactionsQuery } from '@/src/sellings/application/queries/list-transactions.query';
import { RetrieveTransactionsByIdTransactionQuery } from '@/src/sellings/application/queries/retrieve-transactions-by-id-transaction.query';
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';
import { RouteTransactionsSupabaseRepository } from '@/src/sellings/infrastructure/infrastructure/repositories/supabase/route-transactions-supabase.repository';
import { SellingsController } from '@/src/sellings/sellings.controller';
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [SellingsController],
  providers: [
    RegisterTransactionCommand,
    CancelTransactionCommand,
    ListTransactionsQuery,
    RetrieveTransactionsByIdTransactionQuery,
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
