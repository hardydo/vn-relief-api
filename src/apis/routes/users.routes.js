import express from "express";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  toggleUserStatusController,
  getUserByUidFirebaseController,
  getUserByPhoneNumber,
} from "../controllers/users.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

const usersRouter = express.Router();

// Lấy danh sách users
// Query: roles, status, search
usersRouter.get("/", authMiddleware, getUsersController);

// Lấy chi tiết user
usersRouter.get("/:id", authMiddleware, getUserByIdController);

// Lấy chi tiết userby phone
usersRouter.get("/phone/:phoneNumber", authMiddleware, getUserByPhoneNumber);

// Lấy chi tiết user qua uid firebawe
usersRouter.get(
  "/firebase/:uid",
  authMiddleware,
  getUserByUidFirebaseController
);

// Tạo user mới
// Phải đợi xác minh từ admin hoặc TNV
usersRouter.post("/", createUserController);

// Cập nhật user
usersRouter.put("/:id", authMiddleware, updateUserController);

// Thay đổi trạng thái user (active/inactive)
usersRouter.post(
  "/toggle-status",
  authMiddleware,
  adminMiddleware,
  toggleUserStatusController
);

export default usersRouter;
