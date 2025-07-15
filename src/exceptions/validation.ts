import { HttpException } from "./root.ts";

export class UnprocessableEntityException extends HttpException {
  constructor(error: any, message: string, errorCodes: number) {
    super(
      message || "Unprocessable Entity",
      422,
      errorCodes || 1200, // Default to VALIDATION_ERROR
      error
    );
  }
}
