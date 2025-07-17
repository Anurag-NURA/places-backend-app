import express from "express";

import upload from "../middlewares/multer.middleware";
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

router.post("/", upload.single("image"), createPlace);

router.patch("/:placeId", upload.single("image"), updatePlace);

router.delete("/:placeId", deletePlace);

export default router;
