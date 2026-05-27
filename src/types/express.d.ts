import { User, Place } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      place?: Place;
    }
  }
}

export { };
