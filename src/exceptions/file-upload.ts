import { ErrorCode, HttpException } from "./root";

export class FileUploadException extends HttpException {
  constructor(
    message: string = "File Upload Error",
    errorCodes: ErrorCode,
    errors?: any
  ) {
    super(message, 500, errorCodes, errors);
  }
}
