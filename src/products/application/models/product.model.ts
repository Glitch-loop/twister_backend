export interface ProductModel {
  id_product: string;
  product_name: string;
  barcode: string | null;
  cost: number;
  product_status: number;
  quantity_presentation: number;
  order_to_show: number;
  id_measurement_unit: string;
  created_at: Date;
}
