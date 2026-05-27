import { Prisma } from '../generated/prisma/client';
import { BadRequestException, InternalServerException, NotFoundException } from '../exceptions';
import { ErrorCode } from '../exceptions/root';

export const handlePrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException(
          'Resource already exists',
          ErrorCode.PLACE_ALREADY_EXISTS
        );
      case 'P2003':
        throw new BadRequestException(
          'Invalid reference id provided',
          ErrorCode.INVALID_PLACE_ID
        );
      case 'P2025':
        throw new NotFoundException(
          'Resource not found',
          ErrorCode.PLACE_NOT_FOUND
        );
      default:
        throw new InternalServerException(
          `Database error: ${error.code}`,
          ErrorCode.DATABASE_ERROR,
          error.message
        );
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new InternalServerException(
      'Unknown database error occurred',
      ErrorCode.DATABASE_ERROR,
      error.message
    );
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new InternalServerException(
      'Database connection failed',
      ErrorCode.DATABASE_ERROR,
      error.message
    );
  }

  throw error; // rethrow anything unexpected
};
