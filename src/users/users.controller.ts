import { Body, Controller, Post } from '@nestjs/common';
import type { UserDto } from './application/dtos/user.dto';
import { CreateUser } from './application/commands/CreateUser';

@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUser) {}
  @Post()
  async create(@Body() createUserDto: UserDto) {
    // Logic to create a user
    await this.createUser.execute(createUserDto); 
  }
}