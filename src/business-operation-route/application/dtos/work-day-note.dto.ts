import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class WorkDayNoteDto {
	@ApiProperty({ type: String, example: '2d291bb8-2fe8-4e82-93d8-11cf80e302f8' })
	public readonly id_note: string;

	@ApiProperty({ type: String, example: 'Vendor arrived 10 minutes late.' })
	public readonly note: string;

	@ApiProperty({ type: String, example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
	public readonly id_owner: string;

	@ApiPropertyOptional({ type: String, example: '2026-05-27T13:10:00.000Z' })
	public readonly created_at?: Date;

	constructor(
		_id_note: string,
		_note: string,
		_id_owner: string,
		_created_at?: Date,
	) {
		this.id_note = _id_note;
		this.note = _note;
		this.id_owner = _id_owner;
		this.created_at = _created_at;
	}
}