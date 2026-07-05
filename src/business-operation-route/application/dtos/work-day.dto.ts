import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { WorkDayNoteDto } from '@/src/business-operation-route/application/dtos/work-day-note.dto';

export class WorkDayDto {
	@ApiProperty({ type: String, example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
	public readonly id_work_day: string;

	@ApiProperty({ type: String, example: '2026-05-27T08:00:00.000Z' })
	public readonly start_date: string;

	@ApiProperty({ type: Number, example: 2500 })
	public readonly start_petty_cash: number;

	@ApiProperty({ type: String, example: '522f4c66-04ee-4d09-b6f5-8bc9f548c9df' })
	public readonly id_route_day: string;

	@ApiProperty({ type: String, example: 'd56b4bcd-154a-42f0-b2ca-9bc77535f17f' })
	public readonly id_user: string;

	@ApiProperty({ type: [WorkDayNoteDto], example: [] })
	public readonly notes: WorkDayNoteDto[];

	@ApiPropertyOptional({ type: String, format: 'date-time', example: '2026-05-27T18:00:00.000Z' })
	public readonly finish_date: string | null;

	@ApiPropertyOptional({ type: Number, example: 3180.75 })
	public readonly final_petty_cash: number | null;

	@ApiPropertyOptional({ type: String, example: 'ed046ff9-0845-43d4-bfc2-7a5a3d8dca2c' })
	public readonly id_payment_stub: string | null;

	constructor(
		_id_work_day: string,
		_start_date: string,
		_start_petty_cash: number,
		_id_route_day: string,
		_id_user: string,
		_notes: WorkDayNoteDto[],
		_finish_date: string | null,
		_final_petty_cash: number | null,
		_id_payment_stub: string | null,
	) {
		this.id_work_day = _id_work_day;
		this.start_date = _start_date;
		this.start_petty_cash = _start_petty_cash;
		this.id_route_day = _id_route_day;
		this.id_user = _id_user;
		this.notes = _notes;
		this.finish_date = _finish_date;
		this.final_petty_cash = _final_petty_cash;
		this.id_payment_stub = _id_payment_stub;
	}
}