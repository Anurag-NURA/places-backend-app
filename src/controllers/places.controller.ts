import { Request, Response, NextFunction } from "express";

import {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../services/places.service";
import { UnauthorizedException, ErrorCode } from "../exceptions";

class PlacesController {
  // @route   GET /api/places
  // @desc    Get all places
  // @access  Public
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const places = await getAllPlaces();
      res.json({
        success: true,
        message: "Places retrieved successfully",
        data: places,
      });
    } catch (error) {
      next(error);
    }
  }

  // @route   GET /api/places/:placeId
  // @desc    Get place by ID
  // @access  Public
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { placeId } = req.params;
      const place = await getPlaceById(placeId);
      res.json({
        success: true,
        message: "Place retrieved successfully",
        data: place,
      });
    } catch (error) {
      next(error);
    }
  }

  // @route   POST /api/places
  // @desc    Create a new place
  // @access  Private
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          "User not authenticated",
          ErrorCode.UNAUTHORIZED,
        );
      }

      const data = req.body;
      const userId = req.user.id;
      const fileBuffer = req.file?.buffer;
      const newPlace = await createPlace(userId, { ...data }, fileBuffer);
      res.status(201).json({
        success: true,
        message: "Place created successfully",
        data: newPlace,
      });
    } catch (error) {
      next(error);
    }
  }

  // @route   PATCH /api/places/:placeId
  // @desc    Update a place
  // @access  Private
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          "User not authenticated",
          ErrorCode.UNAUTHORIZED,
        );
      }

      const { placeId } = req.params;
      const data = req.body;
      const userId = req.user.id;
      const fileBuffer = req.file?.buffer;
      const updatedPlace = await updatePlace(placeId, data, userId, fileBuffer);
      res.json({
        success: true,
        message: "Place updated successfully",
        data: updatedPlace,
      });
    } catch (error) {
      next(error);
    }
  }

  // @route   DELETE /api/places/:placeId
  // @desc    Delete a place
  // @access  Private
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          "User not authenticated",
          ErrorCode.UNAUTHORIZED,
        );
      }

      const { placeId } = req.params;
      const userId = req.user.id;
      await deletePlace(placeId, userId);
      res.json({
        success: true,
        message: "Place deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const placesController = new PlacesController();
