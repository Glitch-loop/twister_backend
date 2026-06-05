import { ApiProperty } from '@nestjs/swagger';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

export class WorkDayOperationHistoricDto {
	@ApiProperty({ type: String, example: '5f11066f-f551-4f37-8629-a8f2814157f8' })
	public readonly id_work_day_operation: string;
	
	@ApiProperty({ type: String, example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
	public readonly id_work_day: string;
	
	@ApiProperty({ type: String, example: '9aa5f773-f0cf-4d2f-a6d5-f11ff8e79fca' })
	public readonly id_route_day: string;

	@ApiProperty({ enum: DAY_OPERATIONS_ENUM, example: DAY_OPERATIONS_ENUM.sales })
	public readonly id_operation_type: DAY_OPERATIONS_ENUM;

	@ApiProperty({ type: String, example: '2026-05-27T08:20:00.000Z' })
	public readonly created_at: Date;

	@ApiProperty({ type: String, example: '4c89ea4d-e54a-4dcf-8426-330e584f2e5f' })
	public readonly id_location: string | null;

	@ApiProperty({ type: String, example: 'a8d18c34-cf17-4d5f-a830-c6f26d6c976a' })
	public readonly id_route_transaction: string | null;

	@ApiProperty({ type: String, example: 'a8d18c34-cf17-4d5f-a830-c6f26d6c976a' })
	public readonly id_inventory_operation: string | null;

	@ApiProperty({ type: String, example: '19.45602930548609' })
	public readonly latitude: string;

	@ApiProperty({ type: String, example: '-99.13450312485135' })
	public readonly longitude: string;

	@ApiProperty({ type: String, example: '0e72ec26-0df4-4dc0-a204-b8f3223bb8f8' })
	public readonly id_day_operation_dependent: string | null;

	constructor(
		_id_work_day_operation: string,
		_id_operation_type: DAY_OPERATIONS_ENUM,
		_created_at: Date,
		_latitude: string,
		_longitude: string,
		_id_work_day: string,
		_id_location: string | null,
		_id_route_transaction: string | null,
		_id_inventory_operation: string | null,
		_id_route_day: string,
		_id_day_operation_dependent: string | null,
	) {
		this.id_work_day = _id_work_day;
		this.id_operation_type = _id_operation_type;
		this.created_at = _created_at;
		this.latitude = _latitude;
		this.longitude = _longitude;
		this.id_work_day_operation = _id_work_day_operation;
		this.id_location = _id_location;
		this.id_route_transaction = _id_route_transaction;
		this.id_inventory_operation = _id_inventory_operation;
		this.id_route_day = _id_route_day;
		this.id_day_operation_dependent = _id_day_operation_dependent;
	}
}
