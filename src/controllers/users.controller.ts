import type { Request, Response, NextFunction } from "express";
import { randomUUIDv7 } from "bun";

import prisma from "../config/db.config.ts";
import { BadRequestException } from "../exceptions/bad-requests.ts";
import { ErrorCode } from "../exceptions/root.ts";
import {
  UserSchema,
  type User,
  updateUserSchema,
  type UpdateUser,
} from "../models/user.types.ts";
import { success } from "zod/v4";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "John Doe",
    email: "johndoe@email.com",
    password: "password123",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "janesmith@email.com",
    password: "password456",
  },
  {
    id: "u3",
    name: "Alice Johnson",
    email: "alicejohnson@email.com",
    password: "password789",
  },
];

export const getAllUsers = (
  req: Request,
  res: Response<{
    message: string;
    users?: User[];
  }>,
  next: NextFunction
) => {
  try {
    if (!DUMMY_USERS || DUMMY_USERS.length === 0) {
      throw new BadRequestException(
        "No users found",
        404,
        ErrorCode.USER_NOT_FOUND
      );
    }
    res
      .status(200)
      .json({ message: "Users fetched successfully", users: DUMMY_USERS });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request<{
    name: string;
    email: string;
    password: string;
  }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const parsed = UserSchema.omit({ id: true }).safeParse({
      name,
      email,
      password,
    });

    if (!parsed.success) {
      console.log(parsed.error);
      throw new BadRequestException(
        "Invalid request body",
        400,
        ErrorCode.INVALID_REQUEST_BODY,
        parsed.error
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

    const newUser: User = await prisma.user.create({
      data: {
        id: randomUUIDv7(),
        name,
        email,
        password,
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

export const login = (
  req: Request<{
    email: string;
    password: string;
  }>,
  res: Response<{
    message: string;
    user?: User;
  }>,
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

    const parsed = UserSchema.omit({ id: true }).safeParse(req.body);

    if (!parsed.success) {
      console.log(parsed.error);
      throw new BadRequestException(
        "Invalid request body",
        400,
        ErrorCode.INVALID_REQUEST_BODY,
        parsed.error
      );
    }

    const user = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new BadRequestException(
        "Invalid email or password",
        401,
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};
