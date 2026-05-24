// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Repositories
import { LocationSupabaseRepository } from '@/src/clients/infrastructure/repositories/supabase/location-supabase.repository';
import { ClientSupabase } from '@/src/clients/infrastructure/repositories/supabase/client-supabase.repository';

// Datasources
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

// Queries
import { ListClientsQuery } from '@/src/clients/application/queries/list-clients.query';
import { ListLocationsQuery } from '@/src/clients/application/queries/list-locations.query';
import { ListLocationTypesQuery } from '@/src/clients/application/queries/list-location-types.query';
import { RetrieveLocationsByIdClientQuery } from '@/src/clients/application/queries/retrieve-locations-by-id-client.query';
import { RetrieveLocationsByIdCreatorQuery } from '@/src/clients/application/queries/retrieve-locations-by-id-creator.query';

// Commands
import { CreateClientCommand } from '@/src/clients/application/commands/create-client.command';
import { ModifyClientCommand } from '@/src/clients/application/commands/modify-client.command';
import { DeactivateClientCommand } from '@/src/clients/application/commands/deactivate-client.command';
import { CreateLocationCommand } from '@/src/clients/application/commands/create-location.command';
import { ModifyLocationCommand } from '@/src/clients/application/commands/modify-location.command';
import { DeactivateLocationCommand } from '@/src/clients/application/commands/deactivate-location.command';
import { CreationNoteCommand } from '@/src/clients/application/commands/creation-note.command';
import { CreateLocationTypeCommand } from '@/src/clients/application/commands/create-location-type.command';
import { CreateFurnitureCommand } from '@/src/clients/application/commands/create-furniture.command';
import { ModifyFurnitureCommand } from '@/src/clients/application/commands/modify-furniture.command';

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
    CreateClientCommand,
    ModifyClientCommand,
    DeactivateClientCommand,
    CreateLocationCommand,
    ModifyLocationCommand,
    DeactivateLocationCommand,
    CreationNoteCommand,
    CreateLocationTypeCommand,
    CreateFurnitureCommand,
    ModifyFurnitureCommand,
    ListClientsQuery,
    ListLocationsQuery,
    ListLocationTypesQuery,
    RetrieveLocationsByIdClientQuery,
    RetrieveLocationsByIdCreatorQuery,
    EntityDtoMapper,
    EntityModelMapper,
    SupabaseDataSource,
    ClientSupabase,
    LocationSupabaseRepository,
    {
      provide: ClientRepository,
      useExisting: ClientSupabase,
    },
    {
      provide: LocationRepository,
      useExisting: LocationSupabaseRepository,
    },
  ],
})

export class ClientsModule {}
