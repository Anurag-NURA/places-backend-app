import { prisma } from "../config/client";
import { Prisma } from "../generated/prisma/client";
import { handlePrismaError } from "../utils";

class PlacesRepository {
  async findAll() {
    try {
      return await prisma.place.findMany();
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findById(placeId: string) {
    try {
      return await prisma.place.findUnique({ where: { id: placeId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findByUserId(userId: string) {
    try {
      return await prisma.place.findMany({ where: { creatorId: userId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(data: Prisma.PlaceCreateInput) {
    try {
      return await prisma.place.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(placeId: string, data: Prisma.PlaceUpdateInput) {
    try {
      return await prisma.place.update({ where: { id: placeId }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(placeId: string) {
    try {
      return await prisma.place.delete({ where: { id: placeId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

export const placesRepository = new PlacesRepository();
