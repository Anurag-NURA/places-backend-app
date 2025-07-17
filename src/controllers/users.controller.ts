import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";

import { BadRequestException } from "../exceptions/bad-requests.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { formatZodError } from "../utils/formatZodError.ts";

import {
  SignUpSchema,
  type SignInType,
  type UserType,
  type SignUpType,
  type ErrorResponse,
  SignInSchema,
} from "../types/index.ts";

export const getAllUsers = async (
  req: Request,
  res: Response<
    { success: boolean; message: string; users: UserType[] } | ErrorResponse
  >,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      throw new BadRequestException(
        "No users found",
        404,
        ErrorCode.NO_USERS_FOUND
      );
    }

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request<{}, {}, SignUpType> & { file?: Express.Multer.File },
  res: Response<
    { success: boolean; message: string; user: UserType } | ErrorResponse
  >,
  next: NextFunction
) => {
  try {
    //initialize imageUrl to null
    let imageUrl: string | null = null;

    if (req.file) {
      // Get the file path from multer
      const avatar = req.file.path;
      // Upload the file to Cloudinary
      imageUrl = await uploadOnCloudinary(avatar);
    }

    const { name, email, password } = req.body;
    const parsed = SignUpSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new BadRequestException(
        "Invalid request body",
        400,
        ErrorCode.INVALID_REQUEST_BODY,
        formatZodError(parsed.error)
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException(
        "User already exists with this email",
        409,
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    const newUser: UserType = await prisma.user.create({
      data: {
        name,
        email,
        password,
        image: imageUrl,
        createdAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, SignInType>,
  res: Response<{ success: boolean; message: string } | ErrorResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestException(
        "Email and password are required",
        400,
        ErrorCode.MISSING_REQUIRED_FIELDS
      );
    }

    const parsed = SignInSchema.safeParse(req.body);

    if (!parsed.success) {
      console.log(formatZodError(parsed.error));
      throw new BadRequestException(
        "Invalid request body",
        400,
        ErrorCode.INVALID_REQUEST_BODY,
        formatZodError(parsed.error)
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new BadRequestException(
        "User not found with this email",
        401,
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (user.password !== password) {
      throw new BadRequestException(
        "Incorrect password",
        401,
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};
