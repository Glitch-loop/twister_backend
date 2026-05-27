import { HttpException, HttpStatus } from "@nestjs/common";

export class BusinessRuleException extends HttpException {
  constructor(description?: string, status?: number) {
    const errorDescription:string = "Business rule expection: " + (description ? description : 'A business rule has been broken')
    super(
      errorDescription,
      status? status : HttpStatus.BAD_REQUEST
    )
  }
}