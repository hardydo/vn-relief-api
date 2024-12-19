import express from "express";
import {
  getDisastersController,
  getDisasterByIdController,
  createDisasterController,
  updateDisasterController,
  deleteDisasterController,
  getActiveDisastersController
} from "../controllers/natural-disasters.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const naturalDisastersRouter = express.Router();

// Lấy danh sách đợt thiên tai
// Query: status, startDate, endDate
disastersRouter.get("/", authMiddleware, getDisastersController);

// Chi tiết đợt thiên tai
disastersRouter.get("/:id", authMiddleware, getDisasterByIdController);

// Tạo đợt thiên tai mới
disastersRouter.post("/", authMiddleware, adminMiddleware, createDisasterController);

// Cập nhật đợt thiên tai
disastersRouter.put("/:id", authMiddleware, adminMiddleware, updateDisasterController);

// Xóa đợt thiên tai (soft delete)
disastersRouter.delete("/:id", authMiddleware, adminMiddleware, deleteDisasterController);

// Lấy đợt thiên tai đang diễn ra
disastersRouter.get("/active", authMiddleware, getActiveDisastersController);

export default naturalDisastersRouter;