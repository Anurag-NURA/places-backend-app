import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/root.ts";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCodes: error.errorCodes,
      errors: error.errors,
    });
  } else {
    // Handle unknown/unexpected errors
    const isErrorObject = typeof error === "object" && error !== null;
    const genericMessage = "Internal Server Error";

    res.status(500).json({
      success: false,
      message:
        isErrorObject && "message" in error
          ? (error as any).message
          : genericMessage,
      statusCode: 500,
      errorCode: null,
      errors: {
        // Include stack trace or toString value for debugging (you can hide in prod)
        stack: isErrorObject && "stack" in error ? (error as any).stack : null,
        error: isErrorObject ? error.toString() : String(error),
      },
    });
  }
};
