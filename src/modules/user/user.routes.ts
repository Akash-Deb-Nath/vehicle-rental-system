import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import authAdminOrSelf from "../../middleware/authAdminOrSelf";

const router = Router();

const { getUser, deleteUser, updateUser } = userController;
router.get("/", auth("admin"), getUser);
router.put("/:userId", auth(), authAdminOrSelf, updateUser);
router.delete("/:userId", auth("admin"), deleteUser);

export const userRoutes = router;
