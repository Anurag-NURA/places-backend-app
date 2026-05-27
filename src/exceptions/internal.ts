import {ErrorCode, HttpException} from "./root";

export class InternalServerException extends HttpException{
  constructor(
    message: string = "Internal Server Error",
    errorCodes: ErrorCode,
    errors?: any
  ) {
    super(message, 500, errorCodes, errors);
  }
}
