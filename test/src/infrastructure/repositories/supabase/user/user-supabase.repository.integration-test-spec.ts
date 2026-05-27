import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { randomUUID } from 'crypto';
import { UserSupabaseRepository } from '@/src/users/infrastructure/repositories/supabase/user-supabase.repository';
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/application/mappers/entity-model.mapper';
import { UserEntity } from '@/src/users/core/entities/user.entity';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildTestUser(overrides: Partial<UserEntity> = {}): UserEntity {
  return new UserEntity(
    overrides.id_user ?? randomUUID(),
    overrides.cellphone ?? '8112345678',
    overrides.name ?? 'Test User',
    overrides.password ?? 'hashed-password-test',
    overrides.status ?? 1,
    overrides.salary ?? 1500,
    overrides.created_at ?? new Date('2024-01-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2024-01-01T00:00:00.000Z'),
    overrides.address ?? 'Test Address 123',
    overrides.rfc ?? 'TESTXX010101000',
    overrides.imss ?? 'TEST12345678901',
  );
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('UserSupabaseRepository – integration tests', () => {
  let repository: UserSupabaseRepository;
  let dataSource: SupabaseDataSource;
  const createdIds: string[] = [];

  beforeAll(() => {
    if (
      !process.env.PUBLIC_SUPABASE_URL ||
      !process.env.PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error(
        'Integration tests require PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.',
      );
    }

    dataSource = new SupabaseDataSource();
    const mapper = new Mapper();
    repository = new UserSupabaseRepository(dataSource, mapper);
  });

  afterAll(async () => {
    // Clean up every record created during the suite
    const supabase = dataSource.getClient();
    if (createdIds.length > 0) {
      await supabase.from('users').delete().in('id_user', createdIds);
    }
  });

  // -------------------------------------------------------------------------
  describe('createUser', () => {
    it('should insert a user without throwing', async () => {
      const user = buildTestUser();
      createdIds.push(user.id_user);

      await expect(repository.createUser(user)).resolves.toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('retrieveUserById', () => {
    it('should return the user that was previously created', async () => {
      const user = buildTestUser();
      createdIds.push(user.id_user);
      await repository.createUser(user);

      const result = await repository.retrieveUserById([user.id_user]);
      expect(result).not.toBeNull();
      expect(result[0].id_user).toBe(user.id_user);
      expect(result[0].name).toBe(user.name);
      expect(result[0].cellphone).toBe(user.cellphone);
    });

    it('should return multiple users when multiple IDs are provided', async () => {
      const user1 = buildTestUser();
      const user2 = buildTestUser();
      createdIds.push(user1.id_user, user2.id_user);
      await repository.createUser(user1);
      await repository.createUser(user2);

      const result = await repository.retrieveUserById([
        user1.id_user,
        user2.id_user,
      ]);
      expect(result).toHaveLength(2);
      expect(result.map((u) => u.id_user)).toContain(user1.id_user);
      expect(result.map((u) => u.id_user)).toContain(user2.id_user);
    });

    it('should return an empty array for a non-existent user', async () => {
      const result = await repository.retrieveUserById([randomUUID()]);
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  describe('updateUser', () => {
    it('should update the specified fields of an existing user', async () => {
      const user = buildTestUser();
      createdIds.push(user.id_user);
      await repository.createUser(user);

      await repository.updateUser(user.id_user, {
        name: 'Updated Name',
        cellphone: '8119876543',
      });

      const updated = await repository.retrieveUserById([user.id_user]);
      expect(updated[0].name).toBe('Updated Name');
      expect(updated[0].cellphone).toBe('8119876543');
      // Untouched fields should remain
      expect(updated[0].rfc).toBe(user.rfc);
    });

    it('should update salary field correctly', async () => {
      const user = buildTestUser();
      createdIds.push(user.id_user);
      await repository.createUser(user);

      await repository.updateUser(user.id_user, {
        salary: 2500,
      });

      const updated = await repository.retrieveUserById([user.id_user]);
      expect(updated[0].salary).toBe(2500);
    });

    it('should update address, rfc, and imss fields', async () => {
      const user = buildTestUser();
      createdIds.push(user.id_user);
      await repository.createUser(user);

      await repository.updateUser(user.id_user, {
        address: 'New Address 456',
        rfc: 'NEWRFC010101000',
        imss: 'NEW98765432101',
      });

      const updated = await repository.retrieveUserById([user.id_user]);
      expect(updated[0].address).toBe('New Address 456');
      expect(updated[0].rfc).toBe('NEWRFC010101000');
      expect(updated[0].imss).toBe('NEW98765432101');
    });
  });

  // -------------------------------------------------------------------------
  describe('deleteUser', () => {
    it('should remove the user so it can no longer be retrieved', async () => {
      const user = buildTestUser();
      // Do NOT add to createdIds – we will delete it ourselves
      await repository.createUser(user);

      await repository.deleteUser(user.id_user);

      const result = await repository.retrieveUserById([user.id_user]);
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  describe('listUsers', () => {
    it('should include the newly created user in the returned list', async () => {
      const user = buildTestUser();
      createdIds.push(user.id_user);
      await repository.createUser(user);

      const list = await repository.listUsers();

      const found = list.find((u) => u.id_user === user.id_user);
      expect(found).toBeDefined();
      expect(found!.name).toBe(user.name);
    });

    it('should return an array', async () => {
      const list = await repository.listUsers();
      expect(Array.isArray(list)).toBe(true);
    });
  });
});
