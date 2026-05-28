import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkDayNoteRequestDto {
	@ApiProperty({ type: String, example: 'Vendor requested gate access before unloading.' })
	public readonly note: string;

	@ApiProperty({ type: String, example: '2026-05-27T13:10:00.000Z' })
	public readonly created_at: Date;

	constructor(
		private readonly _note: string,
		private readonly _created_at: Date,
	) {
		this.note = _note;
		this.created_at = _created_at;
	}
}