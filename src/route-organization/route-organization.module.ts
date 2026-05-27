// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';

// Repositories
import { SupabaseRouteRepository } from '@/src/route-organization/infrastructure/repositories/supabase/supabase-route.repository';
import { SupabaseRouteProposalsRepository } from '@/src/route-organization/infrastructure/repositories/supabase/supabase-route-proposals.repository';

// Datasources
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Queries
import { RetrieveAssignedRouteDaysByIdUserQuery } from '@/src/route-organization/application/queries/retrieve-assigned-route-days-by-id-user.query';

// Commands
import { CreateNewRouteCommand } from '@/src/route-organization/application/commands/create-new-route.command';
import { DeactivateRouteCommand } from './application/commands/deactivate-route.command';
import { OrganizeRouteDayCommand } from '@/src/route-organization/application/commands/organize-route-day.command';
import { ReactivateRouteCommand } from '@/src/route-organization/application/commands/reactivate-route.command';
import { AssignRouteToVendorCommand } from '@/src/route-organization/application/commands/assign-route-to-vendor.command';
import { UnassignRouteToVendorCommand } from '@/src/route-organization/application/commands/unassign-route-to-vendor.command';
import { UpdateRouteCommand } from '@/src/route-organization/application/commands/update-route.command';
import { CreateRouteDayProposalCommand } from '@/src/route-organization/application/commands/create-route-day-proposal.command';
import { UpdateRouteDayProposalCommand } from '@/src/route-organization/application/commands/update-route-day-proposal.command';
import { DeleteRouteDayProposalCommand } from '@/src/route-organization/application/commands/delete-route-day-proposal.command';

// Queries
import { ListRouteDaysProposalsQuery } from '@/src/route-organization/application/queries/list-route-days-proposals.query';
import { ListRouteDaysQuery } from '@/src/route-organization/application/queries/list-route-days.query';
import { ListRoutesQuery } from '@/src/route-organization/application/queries/list-routes.query';
import { RetrieveRouteDayByRouteDayIdQuery } from '@/src/route-organization/application/queries/retrieve-route-day-by-route_day-id.query';
import { RetrieveRouteDaysProposalsByIdProposalQuery } from '@/src/route-organization/application/queries/retrieve-route-days-proposals-by-proposal-id_proposal.query';

// Mappers
import { Mapper as EntityModelMapper } from '@/src/route-organization/application/mappers/entity-model.mapper';
import { Mapper as EntityDtoMapper } from '@/src/route-organization/application/mappers/entity-dto.mapper';

// Controllers
import { RouteOrganizationController } from '@/src/route-organization/route-organization.controller';


// Modules
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [RouteOrganizationController],
  providers: [
    AssignRouteToVendorCommand,
    CreateNewRouteCommand,
    CreateRouteDayProposalCommand,
    DeleteRouteDayProposalCommand,
    DeactivateRouteCommand,
    ListRouteDaysQuery,
    ListRouteDaysProposalsQuery,
    ListRoutesQuery,
    OrganizeRouteDayCommand,
    ReactivateRouteCommand,
    RetrieveRouteDayByRouteDayIdQuery,
    RetrieveRouteDaysProposalsByIdProposalQuery,
    SupabaseRouteProposalsRepository,
    UnassignRouteToVendorCommand,
    UpdateRouteDayProposalCommand,
    UpdateRouteCommand,
    RetrieveAssignedRouteDaysByIdUserQuery,
    EntityModelMapper,
    EntityDtoMapper,
    {
      provide: RouteRepository,
      useClass: SupabaseRouteRepository,
    },
    {
      provide: RouteProposalRepository,
      useFactory: (...deps: unknown[]): RouteProposalRepository => deps[0] as RouteProposalRepository,
      inject: [SupabaseRouteProposalsRepository],
    },
    SupabaseDataSource,
  ],
})
export class RouteOrganizationModule {}