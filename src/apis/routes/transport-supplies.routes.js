import express from "express";
import {
  getTransportSuppliesController,
  addSupplyToTransportController,
  removeSupplyFromTransportController,
  updateSupplyStatusController,
  distributeSuppliesController
} from "../controllers/transport-supplies.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transportSuppliesRouter = express.Router();

// Lấy danh sách hàng đang vận chuyển
transportSuppliesRouter.get("/transports/:id/supplies", authMiddleware, getTransportSuppliesController);

// Thêm hàng vào chuyến
transportSuppliesRouter.post("/transports/:id/supplies", authMiddleware, addSupplyToTransportController);

// Xóa hàng khỏi chuyến
transportSuppliesRouter.delete("/transports/:id/supplies/:supplyId", authMiddleware, removeSupplyFromTransportController);

// Cập nhật trạng thái
transportSuppliesRouter.put("/transports/:id/supplies/:supplyId/status", authMiddleware, updateSupplyStatusController);

// Phân phối hàng hóa tại điểm đích
transportSuppliesRouter.post("/transports/:id/supplies/distribute", authMiddleware, distributeSuppliesController);

export default transportSuppliesRouter;