export class InventoryBalanceObjectValue {
	constructor(
		public readonly id_inventory_balance: string,
		public readonly quantity: number,
		public readonly created_at: Date,
		public readonly id_location_inventory: string,
		public readonly id_product: string,
	) {}
}
