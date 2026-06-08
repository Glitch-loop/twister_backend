// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { UserRepository } from '@/src/users/core/interfaces/user.repository';

// Interfaces
import { UserDto } from '@/src/users/application/dtos/user.dto';

// Entities
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Mappers
import { Mapper } from '@/src/users/application/mappers/entity-dto.mapper';

@Injectable()
export class ListAllUsers {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mapper: Mapper,
  ) {}

  async execute(): Promise<Partial<UserDto>[]> {
    const users: UserEntity[] = await this.userRepository.listUsers();
    const userDtos: Partial<UserDto>[] = users.map((user) => this.mapper.userEntityToDto(user));
    

    return userDtos.map(({ 
        id_user,
        cellphone,
        name,
        status,
        salary,
        created_at,
        updated_at,
        assigned_roles,
        address,
        rfc,
        imss,
     }) => ({
        id_user,
        cellphone,
        name,
        status,
        salary,
        created_at,
        updated_at,
        assigned_roles,
        address,
        rfc,
        imss,
     }));
  }
}