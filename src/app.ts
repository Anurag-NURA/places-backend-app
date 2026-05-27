import express from "express";
import type {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";

import usersRoutes from "./routes/users.routes.ts";
import placesRoutes from "./routes/places.routes.ts";

import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { BadRequestException } from "./exceptions/bad-requests.ts";
import { ErrorCode } from "./exceptions/root.ts";

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to YourPlaces API",
    routes: {
      users: "/api/users",
      places: "/api/places",
    },
  });
});

app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

// Catch-all route for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new BadRequestException(
    "Route not found",
    404,
    ErrorCode.ROUTE_NOT_FOUND,
    {
      route: req.originalUrl,
    }
  );
  next(error);
});

// Error handling middleware
app.use(errorMiddleware as ErrorRequestHandler);

export default app;
