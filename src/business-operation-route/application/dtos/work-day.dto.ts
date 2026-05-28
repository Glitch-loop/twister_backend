import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { WorkDayNoteDto } from '@/src/business-operation-route/application/dtos/work-day-note.dto';

export class WorkDayDto {
	@ApiProperty({ type: String, example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
	public readonly id_work_day: string;

	@ApiProperty({ type: String, example: '2026-05-27T08:00:00.000Z' })
	public readonly start_date: Date;

	@ApiProperty({ type: String, example: '9aa5f773-f0cf-4d2f-a6d5-f11ff8e79fca' })
	public readonly id_route: string;

	@ApiProperty({ type: Number, example: 2500 })
	public readonly start_petty_cash: number;

	@ApiProperty({ type: String, example: '522f4c66-04ee-4d09-b6f5-8bc9f548c9df' })
	public readonly id_route_day: string;

	@ApiProperty({ type: String, example: 'd56b4bcd-154a-42f0-b2ca-9bc77535f17f' })
	public readonly id_user: string;

	@ApiProperty({ type: [WorkDayNoteDto], example: [] })
	public readonly notes: WorkDayNoteDto[];

	@ApiPropertyOptional({ type: String, example: '2026-05-27T18:00:00.000Z' })
	public readonly finish_date?: Date;

	@ApiPropertyOptional({ type: Number, example: 3180.75 })
	public readonly final_petty_cash?: number;

	@ApiPropertyOptional({ type: String, example: 'ed046ff9-0845-43d4-bfc2-7a5a3d8dca2c' })
	public readonly id_payment_stub?: string;

	constructor(
		private readonly _id_work_day: string,
		private readonly _start_date: Date,
		private readonly _id_route: string,
		private readonly _start_petty_cash: number,
		private readonly _id_route_day: string,
		private readonly _id_user: string,
		private readonly _notes: WorkDayNoteDto[],
		private readonly _finish_date?: Date,
		private readonly _final_petty_cash?: number,
		private readonly _id_payment_stub?: string,
	) {
		this.id_work_day = _id_work_day;
		this.start_date = _start_date;
		this.id_route = _id_route;
		this.start_petty_cash = _start_petty_cash;
		this.id_route_day = _id_route_day;
		this.id_user = _id_user;
		this.notes = _notes;
		this.finish_date = _finish_date;
		this.final_petty_cash = _final_petty_cash;
		this.id_payment_stub = _id_payment_stub;
	}
}