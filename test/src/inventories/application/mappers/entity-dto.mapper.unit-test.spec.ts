import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';

import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';

import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

import { InventoryDto } from '@/src/inventories/application/dtos/inventory.dto';
import { InventoryOperationDto } from '@/src/inventories/application/dtos/inventory-operation.dto';
import { InventoryBalanceDto } from '@/src/inventories/application/dtos/inventory-balance.dto';
import { InventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/inventory-operation-description.dto';
import { RouteInventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/route-inventory-operation-description.dto';

describe('EntityDtoMapper', () => {
  const mapper = new EntityDtoMapper();

  it('toDomainObject maps InventoryBalanceDto to InventoryBalanceObjectValue', () => {
    const dto = new InventoryBalanceDto(
      'bal-1',
      10,
      1,
      100,
      '2026-07-01T00:00:00.000Z',
      '2026-07-01T01:00:00.000Z',
      'inv-1',
      'prod-1',
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(InventoryBalanceObjectValue);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.id_product).toBe('prod-1');
  });

  it('toDomainObject maps RouteInventoryOperationDescriptionDto to InventoryOperationDescriptionObjectValue', () => {
    const dto = new RouteInventoryOperationDescriptionDto(
      'route-desc-1',
      12.5,
      10.1,
      2,
      '2026-07-01T00:00:00.000Z',
      'op-1',
      'prod-1',
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(InventoryOperationDescriptionObjectValue);
    expect(result.id_inventory_operation_description).toBe('route-desc-1');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('toDomainObject maps InventoryOperationDescriptionDto to InventoryOperationDescriptionObjectValue', () => {
    const dto = new InventoryOperationDescriptionDto(
      'desc-1',
      12.5,
      10.1,
      2,
      '2026-07-01T00:00:00.000Z',
      'op-1',
      'prod-1',
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(InventoryOperationDescriptionObjectValue);
    expect(result.id_inventory_operation_description).toBe('desc-1');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('toDomainObject maps InventoryDto to InventoryEntity with nested balances', () => {
    const dto = new InventoryDto(
      'inv-1',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      'Main Warehouse',
      INVENTORY_STATE_ENUM.ACTIVE,
      STOCK_VALIDATION_ENUM.ENABLE,
      '2026-07-01T00:00:00.000Z',
      '2026-07-01T01:00:00.000Z',
      'user-1',
      [
        new InventoryBalanceDto(
          'bal-1',
          10,
          1,
          100,
          '2026-07-01T00:00:00.000Z',
          '2026-07-01T01:00:00.000Z',
          'inv-1',
          'prod-1',
        ),
      ],
      null,
      null,
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(InventoryEntity);
    expect(result.inventory_balance).toHaveLength(1);
    expect(result.inventory_balance[0]).toBeInstanceOf(InventoryBalanceObjectValue);
  });

  it('toDomainObject maps InventoryOperationDto and normalizes undefined optional fields to null', () => {
    const dto = new InventoryOperationDto(
      'op-1',
      MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      '2026-07-01T00:00:00.000Z',
      'user-1',
      'inv-origin',
      'inv-target',
      [
        new InventoryOperationDescriptionDto(
          'desc-1',
          12.5,
          10.1,
          2,
          '2026-07-01T00:00:00.000Z',
          'op-1',
          'prod-1',
        ),
      ],
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(InventoryOperationEntity);
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
    expect(result.inventory_operation_reference).toBeNull();
    expect(result.document_reference).toBeNull();
  });

  it('toDomainObject maps InventoryOperationDto preserving explicit optional values', () => {
    const dto = new InventoryOperationDto(
      'op-2',
      MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      '2026-07-01T00:00:00.000Z',
      'user-1',
      'inv-origin',
      'inv-target',
      [
        new InventoryOperationDescriptionDto(
          'desc-2',
          12.5,
          10.1,
          2,
          '2026-07-01T00:00:00.000Z',
          'op-2',
          'prod-1',
        ),
      ],
      '10.123',
      '-20.456',
      'ref-1',
      'doc-1',
    );

    const result = mapper.toDomainObject(dto);

    expect(result.latitude).toBe('10.123');
    expect(result.longitude).toBe('-20.456');
    expect(result.inventory_operation_reference).toBe('ref-1');
    expect(result.document_reference).toBe('doc-1');
  });

  it('toDto maps InventoryEntity to InventoryDto with nested balances', () => {
    const entity = new InventoryEntity(
      'inv-1',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      'Main Warehouse',
      INVENTORY_STATE_ENUM.ACTIVE,
      STOCK_VALIDATION_ENUM.ENABLE,
      new Date('2026-07-01T00:00:00.000Z'),
      new Date('2026-07-01T01:00:00.000Z'),
      'user-1',
      [
        new InventoryBalanceObjectValue(
          'bal-1',
          10,
          1,
          100,
          new Date('2026-07-01T00:00:00.000Z'),
          new Date('2026-07-01T01:00:00.000Z'),
          'inv-1',
          'prod-1',
        ),
      ],
      null,
      null,
    );

    const result = mapper.toDto(entity);

    expect(result).toBeInstanceOf(InventoryDto);
    expect(result.inventory_balance).toHaveLength(1);
    expect(result.created_at).toBe('2026-07-01T00:00:00.000Z');
  });

  it('toDto maps InventoryOperationEntity to InventoryOperationDto', () => {
    const entity = new InventoryOperationEntity(
      'op-1',
      null,
      null,
      MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      new Date('2026-07-01T00:00:00.000Z'),
      'user-1',
      'inv-origin',
      'inv-target',
      [
        new InventoryOperationDescriptionObjectValue(
          'desc-1',
          12.5,
          10.1,
          2,
          new Date('2026-07-01T00:00:00.000Z'),
          'op-1',
          'prod-1',
        ),
      ],
      null,
      null,
    );

    const result = mapper.toDto(entity);

    expect(result).toBeInstanceOf(InventoryOperationDto);
    expect(result.id_inventory_operation).toBe('op-1');
    expect(result.created_at).toBe('2026-07-01T00:00:00.000Z');
  });

  it('toDto maps InventoryBalanceObjectValue to InventoryBalanceDto', () => {
    const domainObject = new InventoryBalanceObjectValue(
      'bal-1',
      10,
      1,
      100,
      new Date('2026-07-01T00:00:00.000Z'),
      new Date('2026-07-01T01:00:00.000Z'),
      'inv-1',
      'prod-1',
    );

    const result = mapper.toDto(domainObject);

    expect(result).toBeInstanceOf(InventoryBalanceDto);
    expect(result.id_inventory_balance).toBe('bal-1');
    expect(result.updated_at).toBe('2026-07-01T01:00:00.000Z');
  });

  it('toDto maps InventoryOperationDescriptionObjectValue to InventoryOperationDescriptionDto', () => {
    const domainObject = new InventoryOperationDescriptionObjectValue(
      'desc-1',
      12.5,
      10.1,
      2,
      new Date('2026-07-01T00:00:00.000Z'),
      'op-1',
      'prod-1',
    );

    const result = mapper.toDto(domainObject);

    expect(result).toBeInstanceOf(InventoryOperationDescriptionDto);
    expect(result.id_inventory_operation_description).toBe('desc-1');
    expect(result.created_at).toBe('2026-07-01T00:00:00.000Z');
  });

  it('toDomainObject throws when InventoryBalanceDto has invalid created_at format', () => {
    const dto = new InventoryBalanceDto(
      'bal-1',
      10,
      1,
      100,
      'invalid-date',
      '2026-07-01T01:00:00.000Z',
      'inv-1',
      'prod-1',
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid InventoryBalanceDto.created_at format',
    );
  });

  it('toDomainObject throws when InventoryBalanceDto has invalid updated_at format', () => {
    const dto = new InventoryBalanceDto(
      'bal-1',
      10,
      1,
      100,
      '2026-07-01T00:00:00.000Z',
      'invalid-date',
      'inv-1',
      'prod-1',
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid InventoryBalanceModel.updated_at format',
    );
  });

  it('toDomainObject throws when InventoryOperationDescriptionDto has invalid created_at format', () => {
    const dto = new InventoryOperationDescriptionDto(
      'desc-1',
      12.5,
      10.1,
      2,
      'invalid-date',
      'op-1',
      'prod-1',
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid InventoryOperationDescriptionDto.created_at format',
    );
  });

  it('toDomainObject throws when RouteInventoryOperationDescriptionDto has invalid created_at format', () => {
    const dto = new RouteInventoryOperationDescriptionDto(
      'route-desc-1',
      12.5,
      10.1,
      2,
      'invalid-date',
      'op-1',
      'prod-1',
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid RouteInventoryOperationDescriptionDto.created_at format',
    );
  });

  it('toDomainObject throws when InventoryDto has invalid inventory_context', () => {
    const dto = new InventoryDto(
      'inv-1',
      999,
      'Main Warehouse',
      INVENTORY_STATE_ENUM.ACTIVE,
      STOCK_VALIDATION_ENUM.ENABLE,
      '2026-07-01T00:00:00.000Z',
      '2026-07-01T01:00:00.000Z',
      'user-1',
      [],
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid inventory_context in InventoryDto',
    );
  });

  it('toDomainObject throws when InventoryDto has invalid is_active', () => {
    const dto = new InventoryDto(
      'inv-1',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      'Main Warehouse',
      999,
      STOCK_VALIDATION_ENUM.ENABLE,
      '2026-07-01T00:00:00.000Z',
      '2026-07-01T01:00:00.000Z',
      'user-1',
      [],
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid is_active in InventoryDto',
    );
  });

  it('toDomainObject throws when InventoryDto has invalid created_at format', () => {
    const dto = new InventoryDto(
      'inv-1',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      'Main Warehouse',
      INVENTORY_STATE_ENUM.ACTIVE,
      STOCK_VALIDATION_ENUM.ENABLE,
      'invalid-date',
      '2026-07-01T01:00:00.000Z',
      'user-1',
      [],
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid InventoryDto.created_at format',
    );
  });

  it('toDomainObject throws when InventoryDto has invalid updated_at format', () => {
    const dto = new InventoryDto(
      'inv-1',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      'Main Warehouse',
      INVENTORY_STATE_ENUM.ACTIVE,
      STOCK_VALIDATION_ENUM.ENABLE,
      '2026-07-01T00:00:00.000Z',
      'invalid-date',
      'user-1',
      [],
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid InventoryDto.updated_at format',
    );
  });

  it('toDomainObject throws when InventoryOperationDto has invalid movement_type', () => {
    const dto = new InventoryOperationDto(
      'op-1',
      999,
      '2026-07-01T00:00:00.000Z',
      'user-1',
      'inv-origin',
      'inv-target',
      [],
      null,
      null,
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid movement_type in InventoryOperationDto',
    );
  });

  it('toDomainObject throws when InventoryOperationDto has invalid created_at format', () => {
    const dto = new InventoryOperationDto(
      'op-1',
      MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      'invalid-date',
      'user-1',
      'inv-origin',
      'inv-target',
      [],
      null,
      null,
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid InventoryOperationDto.created_at format',
    );
  });

  it('toDomainObject throws when input does not match any supported dto', () => {
    expect(() => mapper.toDomainObject({ invalid: true } as never)).toThrow(
      'Invalid input for mapping to domain object',
    );
  });

  it('toDto throws when input does not match any supported domain object', () => {
    expect(() => mapper.toDto({ invalid: true } as never)).toThrow(
      'Invalid input for mapping to dto',
    );
  });
});
