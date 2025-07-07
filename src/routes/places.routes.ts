import express from "express";

import {
  getAllPlaces,
  placesById,
  placesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places.controller";

const router = express.Router();

router.get("/", getAllPlaces);

router.get("/:placeId", placesById);

router.get("/users/:userId", placesByUserId);

router.post("/", createPlace);

router.patch("/:placeId", updatePlace);

router.delete("/:placeId", deletePlace);

export default router;
