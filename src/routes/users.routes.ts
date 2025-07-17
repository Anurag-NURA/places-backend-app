import express from "express";

import upload from "../middlewares/multer.middleware.ts";
import {
  getAllUsers,
  login,
  register,
} from "../controllers/users.controller.ts";

const router = express.Router();

router.get("/", getAllUsers);

router.route("/register").post(upload.single("avatar"), register);

router.post("/login", upload.none(), login);

export default router;
