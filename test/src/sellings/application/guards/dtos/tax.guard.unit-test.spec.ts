import { isTaxDto } from '@/src/sellings/application/guards/dtos/tax.guard';

describe('isTaxDto', () => {
  it('returns true for a valid tax dto', () => {
    expect(isTaxDto({
      id_tax: 'tax-1',
      tax_name: 'VAT',
      tax_rate: '16',
    })).toBe(true);
  });

  it('returns false when tax_rate is not a string', () => {
    expect(isTaxDto({
      id_tax: 'tax-1',
      tax_name: 'VAT',
      tax_rate: 16,
    })).toBe(false);
  });
});
