export interface ProductPriceModel {
  id_product_price: string;
  price: number;
  created_at: Date;
  id_product: string;
  id_facility: string | null;
  id_location: string | null;
  id_route_day: string | null;
}
