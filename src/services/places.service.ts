import { Prisma } from "../generated/prisma/client";
import { placesRepository } from "../repositories/places.repository";

import { uploadOnCloudinary, deleteFromCloudinary } from "../utils";
import {
  ForbiddenException,
  NotFoundException,
  ErrorCode,
} from "../exceptions";

export const getAllPlaces = async () => placesRepository.findAll();

export const getPlaceById = async (placeId: string) => {
  const place = await placesRepository.findById(placeId);
  if (!place) {
    throw new NotFoundException("Place not found", ErrorCode.PLACE_NOT_FOUND);
  }
  return place;
};

export const createPlace = async (
  userId: string,
  data: Prisma.PlaceCreateInput,
  fileBuffer?: Buffer,
) => {
  let imageUrl: string | null = null;
  let uploadedPublicId: string | null = null; //track cloudinary public id

  try {
    if (fileBuffer) {
      const uploaded = await uploadOnCloudinary(fileBuffer);
      imageUrl = uploaded.secure_url;
      uploadedPublicId = uploaded.public_id;
    }
    const newPlace = await placesRepository.create(
      {
        ...data,
        image_secure_url: imageUrl, // Store the secure URL of the uploaded image
        image_public_id: uploadedPublicId, // Store the public ID for future reference
      },
      userId,
    );
    return newPlace;
  } catch (error) {
    if (uploadedPublicId) {
      await deleteFromCloudinary(uploadedPublicId).catch(() => {
        console.error(
          `Failed to delete uploaded image with public ID: ${uploadedPublicId}`,
        );
      });
    }
    throw error;
  }
};

export const updatePlace = async (
  placeId: string,
  data: Prisma.PlaceUpdateInput,
  userId: string,
  fileBuffer?: Buffer,
) => {
  const place = await placesRepository.findById(placeId);
  if (!place) {
    throw new NotFoundException("Place not found", ErrorCode.PLACE_NOT_FOUND);
  }

  if (place.creatorId !== userId) {
    throw new ForbiddenException(
      "You do not have permission to update this place",
      ErrorCode.FORBIDDEN,
    );
  }

  let imageUrl: string | null = null;
  let uploadedPublicId: string | null = null; //track cloudinary public id

  try {
    if (fileBuffer) {
      const uploaded = await uploadOnCloudinary(fileBuffer);
      imageUrl = uploaded.secure_url;
      uploadedPublicId = uploaded.public_id;
    }

    //if a new image is uploaded, delete the old one from Cloudinary
    if (place.image_public_id && uploadedPublicId) {
      await deleteFromCloudinary(place.image_public_id).catch(() => {
        console.error(
          `Failed to delete old image from Cloudinary with public ID: ${place.image_public_id}`,
        );
      });
    }
    const updatedPlace = await placesRepository.update(placeId, {
      ...data,
      image_secure_url: imageUrl || place.image_secure_url,
      image_public_id: uploadedPublicId || place.image_public_id,
    });
    return updatedPlace;
  } catch (error) {
    if (uploadedPublicId) {
      await deleteFromCloudinary(uploadedPublicId).catch(() => {
        console.error(
          `Failed to delete uploaded image with public ID: ${uploadedPublicId}`,
        );
      });
    }
    throw error;
  }
};

export const deletePlace = async (placeId: string, userId: string) => {
  const place = await placesRepository.findById(placeId);
  if (!place) {
    throw new NotFoundException("Place not found", ErrorCode.PLACE_NOT_FOUND);
  }

  if (place.creatorId !== userId) {
    throw new ForbiddenException(
      "You do not have permission to delete this place",
      ErrorCode.FORBIDDEN,
    );
  }

  const imagePublicId = place.image_public_id;
  if (imagePublicId) {
    await deleteFromCloudinary(imagePublicId).catch(() => {
      console.error(
        `Failed to delete image from Cloudinary with public ID: ${imagePublicId}`,
      );
    });
  }

  return await placesRepository.delete(placeId);
};
