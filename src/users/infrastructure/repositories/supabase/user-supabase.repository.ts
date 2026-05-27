// Libraries
import { Injectable } from '@nestjs/common';

// Repositories
import { UserRepository } from '@/src/users/core/interfaces/user.repository';

// Entities
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Models
import { UserModel } from '@/src/users/application/models/user.model';

// Infrastructure
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Mappers
import { Mapper } from '@/src/users/application/mappers/entity-model.mapper';

@Injectable()
export class UserSupabaseRepository implements UserRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: Mapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createUser(user: UserEntity): Promise<void> {
    try {
      const userModel = this.mapper.toModel(user);
      const { error } = await this.supabase.from('users').insert(userModel);
      if (error) {
        throw new Error('Failed to create user, ' + error.message);
      }
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async retrieveUserById(id_user: string[]): Promise<UserEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select()
        .in('id_user', id_user);

      if (error) {
        throw new Error('Failed to retrieve user by ID');
      }

      if (!data || data.length === 0) {
        return [];
      }

      return (data as UserModel[]).map((user) =>
        this.mapper.toDomainObject(user),
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve user by ID: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async updateUser(
    id_user: string,
    updatedData: Partial<UserEntity>,
  ): Promise<void> {
    try {
      const payload: Partial<UserModel> = {
        ...(updatedData.cellphone !== undefined && {
          cellphone: updatedData.cellphone,
        }),
        ...(updatedData.name !== undefined && { name: updatedData.name }),
        ...(updatedData.password !== undefined && {
          password: updatedData.password,
        }),
        ...(updatedData.status !== undefined && { status: updatedData.status }),
        ...(updatedData.salary !== undefined && { salary: updatedData.salary }),
        ...(updatedData.address !== undefined && {
          address: updatedData.address,
        }),
        ...(updatedData.rfc !== undefined && { rfc: updatedData.rfc }),
        ...(updatedData.imss !== undefined && { imss: updatedData.imss }),
        ...(updatedData.created_at !== undefined && {
          created_at: updatedData.created_at,
        }),
        ...(updatedData.updated_at !== undefined && {
          updated_at: updatedData.updated_at,
        }),
      };

      const { error } = await this.supabase
        .from('users')
        .update(payload)
        .eq('id_user', id_user);

      if (error) {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async deleteUser(id_user: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id_user', id_user);

      if (error) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async listUsers(): Promise<UserEntity[]> {
    try {
      const { data, error } = await this.supabase.from('users').select();

      if (error) {
        throw new Error('Failed to list users');
      }

      if (!data || data.length === 0) {
        return [];
      }

      return (data as UserModel[]).map((user) =>
        this.mapper.toDomainObject(user),
      );
    } catch (error) {
      throw new Error(
        `Failed to list users: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
