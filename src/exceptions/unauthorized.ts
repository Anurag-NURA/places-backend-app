import { HttpException, ErrorCode } from "./root.ts";

export class UnauthorizedException extends HttpException {
  constructor(
    message: string = "Unauthorized",
    errorCodes: ErrorCode = ErrorCode.UNAUTHORIZED,
    errors?: any
  ) {
    super(message, 401, errorCodes, errors);
    this.name = "UnauthorizedException";
  }
}
