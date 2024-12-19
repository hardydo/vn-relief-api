import express from "express";
import {
  getRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController
} from "../controllers/roles.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const rolesRouter = express.Router();

// Danh sách roles
rolesRouter.get("/", authMiddleware, getRolesController);

// Chi tiết role
rolesRouter.get("/:id", authMiddleware, getRoleByIdController);

// Tạo role mới
rolesRouter.post("/", authMiddleware, adminMiddleware, createRoleController);

// Cập nhật role
rolesRouter.put("/:id", authMiddleware, adminMiddleware, updateRoleController);

// Xóa role 
// Khi xóa role phải:
// - Xóa trong bảng user_role: delete * from user_role where role_id == id
// - Update role của user: ví dụ xóa role 1, thì user có roles [1,2,3] phải update thành [2,3]
rolesRouter.delete("/:id", authMiddleware, adminMiddleware, deleteRoleController);

export default rolesRouter;