import type { Request, Response, NextFunction } from "express";

import { BadRequestException } from "../exceptions/bad-requests.ts";
import { ErrorCode } from "../exceptions/root.ts";
import type {
  PlaceParams,
  PlacesByUserIdParams,
  CreatePlaceBody,
} from "../interfaces/places.interface.ts";

import type { PlaceSchema, UpdatePlaceSchema } from "../schema/place.types.ts";
import { placeSchema, updatePlaceSchema } from "../schema/place.types.ts";

const DUMMY_PLACES = [
  {
    id: "p1",
    name: "Central Park",
    description: "A large public park in New York City.",
    location: {
      lat: 40.785091,
      lng: -73.968285,
    },
    creator: "u1",
  },
  {
    id: "p2",
    name: "Statue of Liberty",
    description: "A colossal neoclassical sculpture on Liberty Island.",
    location: {
      lat: 40.689247,
      lng: -74.044502,
    },
    creator: "u2",
  },
  {
    id: "p3 ",
    name: "Eiffel Tower",
    description: "An iron lattice tower on the Champ de Mars in Paris.",
    location: {
      lat: 48.858844,
      lng: 2.294351,
    },
    creator: "u3",
  },
];

export const getAllPlaces = (
  req: Request,
  res: Response<{
    message: string;
    places?: PlaceSchema[];
  }>,
  next: NextFunction
) => {
  try {
    const places = DUMMY_PLACES;

    if (places.length === 0) {
      throw new BadRequestException(
        "No places found",
        ErrorCode.PLACE_NOT_FOUND
      );
    }

    res.json({
      message: "Places retrieved successfully",
      places,
    });
  } catch (error) {
    next(error);
  }
};

export const placesById = (
  req: Request<PlaceParams>,
  res: Response<{
    message: string;
    place?: PlaceSchema;
  }>,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;

    const place = DUMMY_PLACES.find((p) => p.id === placeId);

    if (place) {
      res.json({
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

export const placesByUserId = (
  req: Request<PlacesByUserIdParams>,
  res: Response<{
    message: string;
    places?: PlaceSchema[];
  }>,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const place = DUMMY_PLACES.filter((p) => p.creator === userId);

    if (place.length > 0) {
      res.json({
        message: "Places found for user",
        places: place,
      });
    } else {
      throw new BadRequestException(
        "No places found for the provided userID",
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
export const createPlace = (
  req: Request<{}, {}, CreatePlaceBody>,
  res: Response<{
    message: string;
    place: PlaceSchema;
  }>,
  next: NextFunction
) => {
  try {
    const { name, description, location, creator } = req.body;

    const parsed = placeSchema.omit({ id: true }).safeParse(req.body);

    if (!parsed.success) {
      console.log(parsed.error);
      throw new BadRequestException(
        "Invalid place data",
        ErrorCode.INVALID_REQUEST_BODY
      );
    }

    if (!name || !description || !location || !creator) {
      throw new BadRequestException(
        "Missing required fields: name, description, location, or creator",
        ErrorCode.MISSING_REQUIRED_FIELDS
      );
    }

    const newPlace = {
      id: Math.random().toString(),
      name,
      description,
      location,
      creator,
    };

    DUMMY_PLACES.push(newPlace);

    res.status(201).json({
      message: "Place created successfully",
      place: newPlace,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlace = (
  req: Request<{ placeId: string }, {}, UpdatePlaceSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;

    //validate partial body
    const parsed = updatePlaceSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(parsed.error);
    }

    //If body is valid, check if place exists
    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (placeIndex === -1) {
      throw new BadRequestException(
        "Place not found with the provided placeID",
        ErrorCode.INVALID_PLACE_ID
      );
    }

    //Update the place
    const existingPlace = DUMMY_PLACES[placeIndex];
    const update = req.body as UpdatePlaceSchema;
    const updatedPlace = {
      ...existingPlace,
      ...update,
    };
    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.json({
      message: "Place updated successfully",
      place: updatedPlace,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlace = (
  req: Request<{ placeId: string }>,
  res: Response<{
    message: string;
    place?: PlaceSchema;
  }>,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;

    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (placeIndex === -1) {
      throw new BadRequestException(
        "Place not found with the provided placeID",
        ErrorCode.INVALID_PLACE_ID
      );
    }

    const deletedPlace = DUMMY_PLACES[placeIndex];

    // Remove the place from the dummy data
    DUMMY_PLACES.splice(placeIndex, 1);

    res.json({
      message: "Place deleted successfully",
      place: deletedPlace,
    });
  } catch (error) {
    next(error);
  }
};
