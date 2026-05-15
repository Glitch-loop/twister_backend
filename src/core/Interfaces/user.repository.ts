import { UserEntity } from '@/src/core/entities/user.entity';

export abstract class UserRepository {
  abstract createUser(user: UserEntity): Promise<void>;
  abstract retrieveUserById(id_user: string[]): Promise<UserEntity[]>;
  abstract updateUser(id_user: string, updatedData: Partial<UserEntity>): Promise<void>;
  abstract deleteUser(id_user: string): Promise<void>;
  abstract listUsers(): Promise<UserEntity[]>;
}
