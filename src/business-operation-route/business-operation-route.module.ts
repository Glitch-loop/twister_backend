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
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-model.mapper';

// Commands
import { AddWorkDayCommand } from '@/src/business-operation-route/application/commands/add-work-day.command';
import { AddNoteWorkDayCommand } from '@/src/business-operation-route/application/commands/add-note-work-day.command';
import { CreateWorkDayCommand } from '@/src/business-operation-route/application/commands/create-work-day.command';
import { UpdateWorkDayCommand } from '@/src/business-operation-route/application/commands/update-work-day.command';

// Modules
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BusinessOperationRouteController],
  providers: [
    AddWorkDayCommand,
    AddNoteWorkDayCommand,
    CreateWorkDayCommand,
    UpdateWorkDayCommand,
    Mapper,
    {
      provide: WorkDayRepository,
      useClass: WorkDaySupabaseRepository,
    },
    SupabaseDataSource,
  ],
})
export class BusinessOperationRouteModule {}
