import { isTaxEntity } from '@/src/sellings/application/guards/entities/tax.guard';

describe('isTaxEntity', () => {
  it('returns true for a valid tax entity shape', () => {
    expect(isTaxEntity({
      id_tax: 'tax-1',
      tax_name: 'VAT',
      tax_rate: '16',
    })).toBe(true);
  });

  it('returns false when tax_name is missing', () => {
    expect(isTaxEntity({
      id_tax: 'tax-1',
      tax_rate: '16',
    })).toBe(false);
  });
});
