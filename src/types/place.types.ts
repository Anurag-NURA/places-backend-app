import { z } from "zod";

//zod schema for validating place data
export const placeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  address: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  latitude: z.number().refine((val) => val >= -90 && val <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  longitude: z.number().refine((val) => val >= -180 && val <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
  creatorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

//Infered typescript type from the zod schema
export type PlaceSchema = z.infer<typeof placeSchema>;

//Partial schema for PATCH (excluding id)
export const updatePlaceSchema = placeSchema.omit({ id: true }).partial();
//Infered typescript type for the update schema
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
