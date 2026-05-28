import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkDayNoteRequestDto {
	@ApiProperty({ type: String, example: '2d291bb8-2fe8-4e82-93d8-11cf80e302f8' })
	public readonly id_work_day_notes: string;

	@ApiProperty({ type: String, example: 'Vendor requested gate access before unloading.' })
	public readonly note: string;

	@ApiProperty({ type: String, example: '2026-05-27T13:10:00.000Z' })
	public readonly created_at: Date;

	@ApiProperty({ type: String, example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
	public readonly id_work_day: string;

	constructor(
		private readonly _id_work_day_notes: string,
		private readonly _note: string,
		private readonly _created_at: Date,
		private readonly _id_work_day: string,
	) {
		this.id_work_day_notes = _id_work_day_notes;
		this.note = _note;
		this.created_at = _created_at;
		this.id_work_day = _id_work_day;
	}
}