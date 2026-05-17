// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Repositories
import { LocationSupabaseRepository } from '@/src/clients/infrastructure/repositories/supabase/location-supabase.repository';

// Datasources
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

// Queries
import { ListLocationTypesQuery } from '@/src/clients/application/queries/list-location-types.query';

// Mappers
import { Mapper as EntityDtoMapper } from '@/src/clients/application/mappers/entity-dto.mapper';
import { Mapper as EntityModelMapper } from '@/src/clients/application/mappers/entity-model.mapper';

// Controllers
import { ClientsController } from '@/src/clients/clients.controller';

// Modules
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ClientsController],
  providers: [
    ListLocationTypesQuery,
    EntityDtoMapper,
    EntityModelMapper,
    SupabaseDataSource,
    LocationSupabaseRepository,
    {
      provide: LocationRepository,
      useExisting: LocationSupabaseRepository,
    },
  ],
})

export class ClientsModule {}
