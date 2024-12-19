import express from "express";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  toggleUserStatusController
} from "../controllers/users.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const usersRouter = express.Router();

// Lấy danh sách users
// Query: roles, status, search
usersRouter.get("/", authMiddleware, getUsersController);

// Lấy chi tiết user
usersRouter.get("/:id", authMiddleware, getUserByIdController);

// Tạo user mới
// Phải đợi xác minh từ admin hoặc TNV
usersRouter.post("/", createUserController);

// Cập nhật user
usersRouter.put("/:id", authMiddleware, updateUserController);

// Thay đổi trạng thái user (active/inactive)
usersRouter.post("/toggle-status", authMiddleware, adminMiddleware, toggleUserStatusController);

export default usersRouter;