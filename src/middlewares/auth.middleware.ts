import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { UnauthorizedException } from "../exceptions/unauthorized.ts";

interface JwtPayload {
  userInfo: {
    userId: string;
    email: string;
  };
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //1.extract the token from the Authorization header
    let token;
    let authHeader = req.headers.authorization;

    //2. if the token is not present, return an UnauthorizedException
    if (authHeader || authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      // Extract the token from the header
    } else {
      // If the Authorization header is not present, throw an UnauthorizedException
      throw new UnauthorizedException(
        "Authorization header not provided",
        ErrorCode.UNAUTHORIZED
      );
    }

    //also check if the token is present in the authorization header
    if (!token) {
      throw new UnauthorizedException(
        "Token not provided",
        ErrorCode.UNAUTHORIZED
      );
    }

    //3. if the token is present, verify it using jwt.verify and extract the payload
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    //4. to get the user from payload
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userInfo.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found", ErrorCode.UNAUTHORIZED);
    }

    //5. to attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
