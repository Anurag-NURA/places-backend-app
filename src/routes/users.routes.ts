import express from "express";

import { getAllUsers, login, SignUp } from "../controllers/users.controller.ts";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/register", SignUp);

router.post("/login", login);

export default router;
