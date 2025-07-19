import type { Request, Response, NextFunction } from "express";
import { hashSync, compareSync } from "bcryptjs";

import prisma from "../config/db.config.ts";
import {
  uploadOnCloudinary,
  generateAcessToken,
  generateRefreshToken,
} from "../utils/index.ts";

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
    { success: boolean; message: string; accessToken: string } | ErrorResponse
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
      where: { email: parsed.data.email },
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
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashSync(parsed.data.password, 10),
        image: imageUrl,
        createdAt: new Date(),
      },
    });

    const accessToken = generateAcessToken({
      userId: newUser.id,
      email: newUser.email,
    });
    generateRefreshToken(res, {
      userId: newUser.id,
      email: newUser.email,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, SignInType>,
  res: Response<
    { success: boolean; message: string; accessToken: string } | ErrorResponse
  >,
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
      where: { email: parsed.data.email },
    });

    if (!user) {
      throw new BadRequestException(
        "User not found with this email",
        401,
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!compareSync(parsed.data.password, user.password)) {
      throw new BadRequestException(
        "Incorrect password",
        401,
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    const accessToken = generateAcessToken({
      userId: user.id,
      email: user.email,
    });
    generateRefreshToken(res, {
      userId: user.id,
      email: user.email,
    });

    res
      .status(200)
      .json({ success: true, message: "Login successful", accessToken });
  } catch (error) {
    next(error);
  }
};
