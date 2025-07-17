import express from "express";
import type {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

import config from "./config/config.ts";

import usersRoutes from "./routes/users.routes.ts";
import placesRoutes from "./routes/places.routes.ts";

import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { BadRequestException } from "./exceptions/bad-requests.ts";
import { ErrorCode } from "./exceptions/root.ts";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
