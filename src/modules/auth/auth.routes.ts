import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

const { createUser, loginUser } = authController;

router.post("/signup", createUser);
router.post("/signin", loginUser);

export const authRoutes = router;
