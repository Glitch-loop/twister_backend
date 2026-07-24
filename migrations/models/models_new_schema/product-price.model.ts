export class ProductPriceModel {
  constructor(
    public readonly price: number,
    public readonly created_at: string,
    public readonly id_product: string,
    public readonly id_facility: string | null,
    public readonly id_location: string | null,
    public readonly id_route_day: string | null,
    public readonly id_product_price?: string,
  ) {
  }
}
