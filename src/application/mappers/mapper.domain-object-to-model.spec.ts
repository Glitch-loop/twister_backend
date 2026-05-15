import { Mapper } from './mapper';
import { UserEntity } from '../../core/entities/user.entity';
import { UserModel } from '../../models/user.model';

describe('Mapper - UserEntity to UserModel', () => {
  let mapper: Mapper;

  beforeEach(() => {
    mapper = new Mapper();
  });

  it('should map UserEntity to UserModel correctly', () => {
    const userEntity: UserEntity = {
      id_user: '123',
      cellphone: '555-1234',
      name: 'John Doe',
      password: 'securepassword',
      status: 'active',
      salary: 50000,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      address: '123 Main St',
      rfc: 'RFC123',
      imss: 'IMSS123',
    };

    const expectedModel: UserModel = {
      id_user: '123',
      cellphone: '555-1234',
      name: 'John Doe',
      password: 'securepassword',
      status: 'active',
      salary: 50000,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      address: '123 Main St',
      rfc: 'RFC123',
      imss: 'IMSS123',
    };

    const result = mapper.toModel(userEntity);
    expect(result).toEqual(expectedModel);
  });
});