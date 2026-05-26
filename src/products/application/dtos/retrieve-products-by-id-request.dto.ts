import { ApiProperty } from '@nestjs/swagger';

export class RetrieveProductsByIdRequestDto {
  @ApiProperty({
    type: String,
    isArray: true,
    example: [
      '53dc3ca4-f9db-4c22-86b6-8f71fc562dc5',
      '9f3a1e8a-23cc-49e2-8f07-c4f40c1597af',
    ],
  })
  public readonly id_product: string[];

  constructor(id_product: string[]) {
    this.id_product = id_product;
  }
}
