export class ProductPriceObjectValue {
  constructor(
    public readonly id_product_price: string,
    public readonly price: number,
    public readonly created_at: Date,
    public readonly id_facility?: string,
    public readonly id_location?: string,
    public readonly id_route_day?: string,
  ) {}
}
