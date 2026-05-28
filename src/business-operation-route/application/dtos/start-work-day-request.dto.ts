import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartShiftWorkDayRequestDto {
	@ApiPropertyOptional({ type: String, example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
	public readonly id_work_day: string;

	@ApiProperty({ type: String, example: '2026-05-27T08:00:00.000Z' })
	public readonly start_date: Date;

	@ApiProperty({ type: Number, example: 2500 })
	public readonly start_petty_cash: number;

	@ApiProperty({ type: String, example: '522f4c66-04ee-4d09-b6f5-8bc9f548c9df' })
	public readonly id_route_day: string;

	@ApiProperty({ type: String, example: 'd56b4bcd-154a-42f0-b2ca-9bc77535f17f' })
	public readonly id_user: string;

	constructor(
		private readonly _id_work_day: string,
		private readonly _start_date: Date,
		private readonly _start_petty_cash: number,
		private readonly _id_route_day: string,
		private readonly _id_user: string
	) {
		this.id_work_day = _id_work_day;
		this.start_date = _start_date;
		this.start_petty_cash = _start_petty_cash;
		this.id_route_day = _id_route_day;
		this.id_user = _id_user;
	}
}