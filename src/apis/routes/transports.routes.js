import express from "express";
import {
  getTransportsController,
  getTransportByIdController,
  createTransportController,
  updateTransportController,
  deleteTransportController
} from "../controllers/transports.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transportsRouter = express.Router();

// Lấy danh sách vận chuyển
// filter - status: 'pending' | 'in_progress' | 'completed'
// vehicleId, startDate, endDate
transportsRouter.get("/", authMiddleware, getTransportsController);

// Lấy chi tiết vận chuyển
transportsRouter.get("/:id", authMiddleware, getTransportByIdController);

// Tạo vận chuyển mới
transportsRouter.post("/", authMiddleware, createTransportController);

// Cập nhật thông tin vận chuyển
transportsRouter.put("/:id", authMiddleware, updateTransportController);

// Hủy vận chuyển
transportsRouter.delete("/:id", authMiddleware, deleteTransportController);

export default transportsRouter;