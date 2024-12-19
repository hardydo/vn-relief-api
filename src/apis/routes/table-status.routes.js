import express from "express";
import {
  getAllTableStatusController,
  getTableStatusController,
  createTableStatusController,
  updateTableStatusController,
  deleteTableStatusController
} from "../controllers/table-status.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const tableStatusRouter = express.Router();

// Lấy tất cả trạng thái bảng
tableStatusRouter.get("/", authMiddleware, getAllTableStatusController);

// Lấy ra các trạng thái của bảng
// :table là tên bảng 
tableStatusRouter.get("/:table", authMiddleware, getTableStatusController);

// Tạo mới trạng thái
tableStatusRouter.post("/", authMiddleware, adminMiddleware, createTableStatusController);

// Cập nhật trạng thái
tableStatusRouter.put("/:id", authMiddleware, adminMiddleware, updateTableStatusController);

// Xóa trạng thái
tableStatusRouter.delete("/:id", authMiddleware, adminMiddleware, deleteTableStatusController);

export default tableStatusRouter;