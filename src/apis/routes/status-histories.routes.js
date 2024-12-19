import express from "express";
import {
  getAllHistoriesController,
  getStatusHistoryController,
  createHistoryController,
  updateHistoryController,
  deleteHistoryController
} from "../controllers/status-histories.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const statusHistoriesRouter = express.Router();

// Lấy tất cả lịch sử
statusHistoriesRouter.get("/", authMiddleware, getAllHistoriesController);

// Lấy lịch sử của một record
// table: tên bảng, id: id trong bảng đó
statusHistoriesRouter.get("/:table/:id", authMiddleware, getStatusHistoryController);

// Tạo mới lịch sử
statusHistoriesRouter.post("/", authMiddleware, adminMiddleware, createHistoryController);

// Cập nhật lịch sử
statusHistoriesRouter.put("/:id", authMiddleware, adminMiddleware, updateHistoryController);

// Xóa lịch sử
statusHistoriesRouter.delete("/:id", authMiddleware, adminMiddleware, deleteHistoryController);

export default statusHistoriesRouter;