import { ErrorCode, HttpException } from "./root";

export class FileUploadException extends HttpException {
  constructor(
    message: string = "File Upload Error",
    statusCode: number = 400,
    errorCodes: ErrorCode,
    errors?: any
  ) {
    super(message, statusCode, errorCodes, errors);
  }
}
