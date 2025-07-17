import type { Request, Response, NextFunction } from "express";

import prisma from "../config/db.config.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { BadRequestException } from "../exceptions/bad-requests.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { formatZodError } from "../utils/formatZodError.ts";

import {
  placeSchema,
  updatePlaceSchema,
  type PlaceSchema,
  type UpdatePlaceSchema,
  type ErrorResponse,
} from "../types/index.ts";

export const getAllPlaces = async (
  req: Request,
  res: Response<
    { success: boolean; message: string; places: PlaceSchema[] } | ErrorResponse
  >,
  next: NextFunction
) => {
  try {
    const places = await prisma.place.findMany();

    if (places.length === 0) {
      throw new BadRequestException(
        "No places found",
        404,
        ErrorCode.PLACE_NOT_FOUND
      );
    }

    res.json({
      success: true,
      message: "Places retrieved successfully",
      places,
    });
  } catch (error) {
    next(error);
  }
};

export const placesById = async (
  req: Request<{ placeId: string }>,
  res: Response<
    { success: boolean; message: string; place: PlaceSchema } | ErrorResponse
  >,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;

    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (place) {
      res.json({
        success: true,
        message: "Place found",
        place,
      });
    } else {
      throw new BadRequestException(
        "Place not found with the provided placeID",
        404,
        ErrorCode.PLACE_NOT_FOUND
      );
    }
  } catch (error) {
    next(error);
  }
};

export const placesByUserId = async (
  req: Request<{ userId: string }>,
  res: Response<
    { success: boolean; message: string; places: PlaceSchema[] } | ErrorResponse
  >,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    const place = await prisma.place.findMany({
      where: { creatorId: userId },
    });

    if (place.length > 0) {
      res.json({
        success: true,
        message: "Places found for user",
        places: place,
      });
    } else {
      throw new BadRequestException(
        "No places found for the provided userID",
        404,
        ErrorCode.PLACE_NOT_FOUND
      );
    }
  } catch (error) {
    next(error);
  }
};

/* 
  Request<{}, {}, CreatePlaceBody> is used to tell TS:
  “This handler cares about a request body, 
  and here’s what it should look like.”
*/
export const createPlace = async (
  req: Request<{}, {}, PlaceSchema> & { file?: Express.Multer.File },
  res: Response<{
    success: boolean;
    message: string;
  }>,
  next: NextFunction
) => {
  try {
    let imageUrl: string | null = null;
    if (req.file) {
      // Get the file path from multer
      const image = req.file.path;
      console.log("Image path from multer:", image);
      // Upload the file to Cloudinary
      imageUrl = await uploadOnCloudinary(image);
      console.log("Image uploaded to Cloudinary:", imageUrl);
    }

    const parsedData = placeSchema
      .omit({ id: true, createdAt: true, updatedAt: true, image: true })
      .safeParse(req.body);

    if (!parsedData.success) {
      console.log(parsedData.error);
      throw new BadRequestException(
        "Invalid place data",
        400,
        ErrorCode.INVALID_REQUEST_BODY,
        formatZodError(parsedData.error)
      );
    }

    const response = await prisma.place.create({
      data: {
        ...parsedData.data,
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (!response) {
      throw new BadRequestException(
        "Failed to create place",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }

    res.status(201).json({
      success: true,
      message: "Place created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlace = async (
  req: Request<{ placeId: string }, {}, UpdatePlaceSchema>,
  res: Response<{ success: boolean; message: string } | ErrorResponse>,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;

    //validate partial body
    const parsed = updatePlaceSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(parsed.error);
      throw new BadRequestException(
        "Invalid update data",
        400,
        ErrorCode.INVALID_REQUEST_BODY,
        formatZodError(parsed.error)
      );
    }

    //If body is valid, check if place exists
    const currentPlace = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!currentPlace) {
      throw new BadRequestException(
        "Place not found with the provided placeID",
        404,
        ErrorCode.INVALID_PLACE_ID
      );
    }

    //Update place with the provided data
    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        ...parsed.data,
        updatedAt: new Date(),
      },
    });

    //If update fails, throw an error
    if (!updatedPlace) {
      throw new BadRequestException(
        "Failed to update place",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }

    //If update is successful, send response
    res.json({
      success: true,
      message: "Place updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlace = async (
  req: Request<{ placeId: string }>,
  res: Response<{ success: boolean; message: string } | ErrorResponse>,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;

    const response = await prisma.place.delete({
      where: { id: placeId },
    });

    if (!response) {
      throw new BadRequestException(
        "Failed to delete place",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }

    res.json({
      success: true,
      message: "Place deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
