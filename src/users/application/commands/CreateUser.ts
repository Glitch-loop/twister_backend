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
export class CreateUser {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mapper: Mapper,
  ) {}

  async execute(user: UserDto): Promise<void> {
    const userEntity: UserEntity = this.mapper.userDtoToEntity(user);
    await this.userRepository.createUser(userEntity);
  }
}