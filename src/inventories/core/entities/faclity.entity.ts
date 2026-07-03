import { FacilityTypeObjectValue } from "@/src/inventories/core/value-objects/facility-type.object-value";

export class FacilityEntity {
	constructor(
		public readonly id_facility: string,
		public readonly street: string,
		public readonly ext_number: string,
		public readonly colony: string,
		public readonly postal_code: string,
		public readonly facility_name: string,
		public readonly latitude: string,
		public readonly longitude: string,
		public readonly is_active: number,
		public readonly id_facility_type: FacilityTypeObjectValue,
	) {}
}
