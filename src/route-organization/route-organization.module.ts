// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

// Repositories
import { SupabaseRouteRepository } from '@/src/route-organization/infrastructure/repositories/supabase/SupabaseRouteRepository';

// Datasources
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

// Queries

// Commands
import { OrganizeRouteDayCommand } from '@/src/route-organization/application/commands/organize-route-day.command';

// Mappers
import { Mapper as EntityModelMapper } from '@/src/route-organization/application/mappers/entity-model.mapper';
// import { Mapper as EntityDtoMapper } from '@/src/route-organization/application/mappers/entity-dto.mapper';

// Controllers
import { RouteOrganizationController } from '@/src/route-organization/route-organization.controller';


// Modules
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [RouteOrganizationController],
  providers: [
    OrganizeRouteDayCommand,
    EntityModelMapper,
    // EntityDtoMapper,
    {
      provide: RouteRepository,
      useClass: SupabaseRouteRepository,
    },
    SupabaseDataSource,
  ],
})
export class RouteOrganizationModule {}