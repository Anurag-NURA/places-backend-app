import { Router } from "express";

import upload from "../middlewares/multer.middleware.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import {
  getAllUsers,
  login,
  register,
} from "../controllers/users.controller.ts";

const router: Router = Router();

router.get("/", verifyJWT, getAllUsers);

router.route("/register").post(upload.single("avatar"), register);

router.post("/login", upload.none(), login);

export default router;
