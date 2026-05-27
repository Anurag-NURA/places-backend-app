import express from "express";

import upload from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { PlacePolicy } from "../policies/places.policy.ts";
import { validate } from "../middlewares/validate.middleware.ts";

import { placeSchema, updatePlaceSchema } from "../types/place.types.ts";

import { placesController } from "../controllers/places.controller";

const router = express.Router();

router
  .route("/")
  .get(placesController.getAll)
  .post(
    verifyJWT,
    upload.single("image"),
    validate(placeSchema),
    placesController.create,
  );

router.route("/creator/:creatorId").get(placesController.getByCreatorId);

router
  .route("/:placeId")
  .get(placesController.getById)
  .patch(
    verifyJWT,
    upload.single("image"),
    validate(updatePlaceSchema),
    placesController.update,
  )
  .delete(verifyJWT, placesController.delete);

export default router;
