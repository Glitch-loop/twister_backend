import { ApiProperty } from '@nestjs/swagger';

export class RetrieveInventoriesByIdRequestDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['8d4c3b2a-1f0e-4d9c-8b7a-6e5d4c3b2a10'],
  })
  public readonly id_inventory: string[];
}
