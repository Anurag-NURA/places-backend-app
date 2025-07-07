import { z } from "zod";

//zod schema for validating place data
export const placeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  creator: z.string(),
});

//Infered typescript type from the zod schema
export type PlaceSchema = z.infer<typeof placeSchema>;

//Partial schema for PATCH (excluding id)
export const updatePlaceSchema = placeSchema.omit({ id: true }).partial();
//Infered typescript type for the update schema
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
