import { ApiProperty } from '@nestjs/swagger';

export class FinishWorkDayRequestDto {
	@ApiProperty({ type: String, example: '2026-05-27T18:00:00.000Z' })
	public readonly finish_date?: Date;

	@ApiProperty({ type: Number, example: 3180.75 })
	public readonly final_petty_cash?: number;

	constructor(
		private readonly _finish_date: Date,
		private readonly _final_petty_cash: number,
	) {
		this.finish_date = _finish_date;
		this.final_petty_cash = _final_petty_cash;
	}
}