import { RequestHandler } from "express";
import { AnyZodObject } from "zod";

import { BadRequestException, ErrorCode } from "../exceptions";
import { formatZodError } from "../utils";

export const validate = (schema: AnyZodObject): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new BadRequestException(
          "Invalid request data",
          ErrorCode.VALIDATION_ERROR,
          formatZodError(result.error),
        ),
      );
    }
    req.body = result.data; //replace body with parsed data
    next();
  };
};
