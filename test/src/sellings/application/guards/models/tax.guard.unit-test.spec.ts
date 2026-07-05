import { isTaxModel } from '@/src/sellings/application/guards/models/tax.guard';

describe('isTaxModel', () => {
  it('returns true for a valid tax model', () => {
    expect(isTaxModel({
      id_tax: 'tax-1',
      tax_name: 'VAT',
      tax_rate: '16',
    })).toBe(true);
  });

  it('returns false when id_tax is not a string', () => {
    expect(isTaxModel({
      id_tax: 1,
      tax_name: 'VAT',
      tax_rate: '16',
    })).toBe(false);
  });
});
