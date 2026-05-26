import { HttpException, HttpStatus } from "@nestjs/common";

export class BusinessRuleException extends HttpException {
  constructor(description?: string, status?: number) {
    super(
      description ? description : 'A business rule has been broken',
      status? status : HttpStatus.BAD_REQUEST
    )
  }
}