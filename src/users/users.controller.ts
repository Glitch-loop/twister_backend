// Libraries
import { Body, Controller, Post, Get } from '@nestjs/common';

// DTOs
import type { UserDto } from '@/src/users/application/dtos/user.dto';

// Commands
import { CreateUser } from '@/src/users/application/commands/CreateUser';

// Queries
import { ListAllUsers } from '@/src/users/application/queries/ListAllUsers';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly listAllUsers: ListAllUsers,
  ) {}
  @Post()
  async create(@Body() createUserDto: UserDto) {
    // Logic to create a user
    await this.createUser.execute(createUserDto); 

    return { message: 'User created successfully' };
  }

  @Get()
  async findAll() {
    // Logic to retrieve all users
    const users = await this.listAllUsers.execute(); 

    return { message: 'Users retrieved successfully', data: users };
  }
}