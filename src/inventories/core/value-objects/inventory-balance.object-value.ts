export class InventoryBalanceObjectValue {
	constructor(
		public readonly id_inventory_balance: string,
		public readonly quantity: number,
		public readonly min_quantity: number | null,
		public readonly max_quantity: number | null,
		public readonly created_at: Date,
		public readonly updated_at: Date,
		public readonly id_inventory: string,
		public readonly id_product: string,
	) {}
}
