import { HttpException, ErrorCode } from "./root.ts";

export class ForbiddenException extends HttpException {
  constructor(
    message: string = "Forbidden",
    errorCodes: ErrorCode = ErrorCode.FORBIDDEN,
    errors?: unknown
  ) {
    super(message, 403, errorCodes, errors);
    this.name = "ForbiddenException";
  }
}
