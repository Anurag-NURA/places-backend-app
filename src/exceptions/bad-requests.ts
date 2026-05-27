import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException {
  constructor(
    message: string = "Bad Request",
    errorCodes: ErrorCode,
    errors?: any
  ) {
    super(message, 400, errorCodes, errors);
  }
}
