import { RequestHandler } from "express";
import { placesRepository } from "../repositories/places.repository.ts";

import { ErrorCode} from "../exceptions/root.ts";
import { NotFoundException } from "../exceptions/not-found.ts";

export const loadPlace: RequestHandler = async (req, res, next) => {
  try {
    const place = await placesRepository.findPlaceById(req.params.placeId);

    if (!place) {
      throw new NotFoundException(
        "Place not found",
        ErrorCode.PLACE_NOT_FOUND
      );
    }

    //attaches place to the request object for use in subsequent middleware or route handlers
    req.place = place; 
    next();
  } catch (error) {
    next(error);
  }
}
