import { ErrorCode } from "../exceptions/root";

export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  errorCodes: ErrorCode;
  errors?: any;
}
