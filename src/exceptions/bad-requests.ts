import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException {
  constructor(
    message: string = "Bad Request",
    statusCode: number = 400,
    errorCodes: ErrorCode,
    errors?: any
  ) {
    super(message, statusCode, errorCodes, errors);
  }
}
