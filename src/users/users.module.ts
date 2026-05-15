import { Module } from '@nestjs/common';
import { UserSupabaseRepository } from '@/src/users/infrastructure/repositories/supabase/user-supabase.repository';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { CreateUser } from '@/src/users/application/commands/CreateUser';
import { Mapper as EntityDtoMapper } from '@/src/application/mappers/entity-dto.mapper';
import { Mapper as EntityModelMapper } from '@/src/application/mappers/entity-model.mapper';
import { UserRepository } from '@/src/users/core/interfaces/user.repository';
import { UsersController } from './users.controller';

@Module({ 
  controllers: [UsersController],
  providers: [
    CreateUser,
    EntityDtoMapper,
    EntityModelMapper,
    SupabaseDataSource,
    UserSupabaseRepository,
    {
      provide: UserRepository,
      useExisting: UserSupabaseRepository,
    },
  ],
})


export class UsersModule {}
