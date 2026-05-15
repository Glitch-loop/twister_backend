// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { UserRepository } from '@/src/users/core/interfaces/user.repository';

// Repositories
import { UserSupabaseRepository } from '@/src/users/infrastructure/repositories/supabase/user-supabase.repository';

// Datasources
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

// Commands
import { CreateUser } from '@/src/users/application/commands/CreateUser';

//Query
import { ListAllUsers } from '@/src/users/application/queries/ListAllUsers';

// Mappers
import { Mapper as EntityDtoMapper } from '@/src/users/application/mappers/entity-dto.mapper';
import { Mapper as EntityModelMapper } from '@/src/users/application/mappers/entity-model.mapper';


import { UsersController } from './users.controller';

@Module({ 
  controllers: [UsersController],
  providers: [
    CreateUser,
    EntityDtoMapper,
    EntityModelMapper,
    SupabaseDataSource,
    UserSupabaseRepository,
    ListAllUsers,
    {
      provide: UserRepository,
      useExisting: UserSupabaseRepository,
    },
  ],
})


export class UsersModule {}
