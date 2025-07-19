import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateAcessToken = (userInfo: any) => {
  return jwt.sign({ userInfo }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (
  res: Response,
  userInfo: {
    userId: string;
    email: string;
  }
) => {
  const refreshToken = jwt.sign(userInfo, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  // Store the refresh token in a secure place, e.g., database or in-memory store
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax", // Adjust as necessary
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
