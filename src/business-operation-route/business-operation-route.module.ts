// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { BusinessOperationRouteController } from '@/src/business-operation-route/business-operation-route.controller';

// Interfaces
import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';

// Repositories
import { WorkDaySupabaseRepository } from '@/src/business-operation-route/infrastructure/repositories/supabase/work-day-supabase.repository';

// Datasources
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Mappers
import { Mapper as EntityModelMapper } from '@/src/business-operation-route/application/mappers/entity-model.mapper';
import { Mapper as EntityDtoMapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';

// Commands
import { AddWorkDayCommand } from '@/src/business-operation-route/application/commands/add-work-day.command';
import { AddNoteWorkDayCommand } from '@/src/business-operation-route/application/commands/add-note-work-day.command';
import { StartWorkDayCommand } from '@/src/business-operation-route/application/commands/start-work-day.command';
import { UpdateWorkDayCommand } from '@/src/business-operation-route/application/commands/finish-work-day.command';

// Queries
import { ListWorkDayQuery } from '@/src/business-operation-route/application/queries/list-work-day.query';
import { ListWorkDayOperationsHistoricQuery } from '@/src/business-operation-route/application/queries/list-work-day-operations-historic.query';
import { RetrieveWorkDayByWorkDayIdQuery } from '@/src/business-operation-route/application/queries/retrieve-work-day-by-work-day-id.query';
import { RetrieveWorkDayOperationsHistoricByWorkDayIdQuery } from '@/src/business-operation-route/application/queries/retrieve-work-day-operations-historic-by-work-day-id.query';

// Modules
import { SharedModule } from '@/src/shared/shared.module';
import { RouteOrganizationModule } from '@/src/route-organization/route-organization.module';

@Module({
  imports: [SharedModule, RouteOrganizationModule],
  controllers: [BusinessOperationRouteController],
  providers: [
    AddWorkDayCommand,
    AddNoteWorkDayCommand,
    StartWorkDayCommand,
    UpdateWorkDayCommand,
    ListWorkDayQuery,
    ListWorkDayOperationsHistoricQuery,
    RetrieveWorkDayByWorkDayIdQuery,
    RetrieveWorkDayOperationsHistoricByWorkDayIdQuery,
    EntityModelMapper,
    EntityDtoMapper,
    {
      provide: WorkDayRepository,
      useClass: WorkDaySupabaseRepository,
    },
    SupabaseDataSource,
  ],
})
export class BusinessOperationRouteModule {}
