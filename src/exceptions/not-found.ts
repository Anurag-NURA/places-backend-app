import {ErrorCode, HttpException} from "./root";

export class NotFoundException extends HttpException{
  constructor(
    message: string = "Not Found",
    errorCodes: ErrorCode,
    errors?: any
  ) {
    super(message, 404, errorCodes, errors);
  }
}


