import express from "express";
import {
  getUserRolesController,
  updateUserRolesController
} from "../controllers/user-roles.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRolesRouter = express.Router();

// Lấy roles của user
userRolesRouter.get("/:id/roles", authMiddleware, getUserRolesController);

// Cập nhật roles cho user
// Body truyền roles: [roleIds]
userRolesRouter.post("/:id/roles", authMiddleware, updateUserRolesController);

export default userRolesRouter;