import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@/src/core/Interfaces/user.repository';
import { Mapper } from '@/src/application/mappers/entity-dto.mapper';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '@/src/core/entities/user.entity';

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