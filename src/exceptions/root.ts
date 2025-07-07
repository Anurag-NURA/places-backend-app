// message, status code, error codes, error
export class HttpException extends Error {
  public message: string;
  public errorCodes?: number;
  public statusCode: number;
  public errors?: ErrorCode;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCodes?: number,
    errors?: ErrorCode
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCodes = errorCodes;
    this.errors = errors;
  }
}

export enum ErrorCode {
  // ==== USER-RELATED ERRORS (1000–1099) ====
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  INVALID_USER_ID = 1004,

  // ==== PLACE-RELATED ERRORS (1100–1199) ====
  PLACE_NOT_FOUND = 1101,
  PLACE_ALREADY_EXISTS = 1102,
  PLACE_CREATION_FAILED = 1103,
  PLACE_UPDATE_FAILED = 1104,
  INVALID_PLACE_ID = 1105,

  // ==== VALIDATION ERRORS (1200–1299) ====
  VALIDATION_ERROR = 1200,
  MISSING_REQUIRED_FIELDS = 1201,
  INVALID_REQUEST_BODY = 1202,
  INVALID_QUERY_PARAM = 1203,

  // ==== AUTHENTICATION & AUTHORIZATION (1300–1399) ====
  UNAUTHORIZED = 1301,
  FORBIDDEN = 1302,
  TOKEN_EXPIRED = 1303,
  INVALID_TOKEN = 1304,

  // ==== SERVER/INTERNAL ERRORS (1400–1499) ====
  INTERNAL_SERVER_ERROR = 1400,
  DATABASE_ERROR = 1401,
  UNKNOWN_ERROR = 1402,
}
