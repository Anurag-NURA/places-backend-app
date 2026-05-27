import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

import { prisma } from "../config/client.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { UnauthorizedException } from "../exceptions/unauthorized.ts";

export const verifyJWT: RequestHandler = async (req, res, next) => {
  try {
    //1.extract the token from the Authorization header
    let token;
    let authHeader = req.headers.authorization;

    //2. if the token is not present, return an UnauthorizedException
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      // Extract the token from the header
    } else {
      // If the Authorization header is not present, throw an UnauthorizedException
      throw new UnauthorizedException(
        "Authorization header not provided",
        ErrorCode.UNAUTHORIZED,
      );
    }

    //also check if the token is present in the authorization header
    if (!token) {
      throw new UnauthorizedException(
        "Token not provided",
        ErrorCode.UNAUTHORIZED,
      );
    }

    //3. if the token is present, decode it first and verify it using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // 4check:
    // i. if the decoded token is an object
    // ii. if the decoded token is not null
    // iii. if the decoded token has a userInfo property
    if (typeof decoded !== "object" || !decoded || !decoded.userInfo) {
      throw new UnauthorizedException(
        "Invalid token payload",
        ErrorCode.UNAUTHORIZED,
      );
    }

    //4. to get the user from payload
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userInfo.userId,
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
