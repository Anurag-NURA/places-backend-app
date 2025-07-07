import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/root.ts";
import { success } from "zod/v4";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    errorCode: error.errorCodes,
    errors: error.errors,
  });
};
