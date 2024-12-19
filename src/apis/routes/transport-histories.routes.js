import express from "express";
import {
  getTransportHistoriesController,
  addCheckpointController,
  updateCheckpointStatusController
} from "../controllers/transport-histories.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transportHistoriesRouter = express.Router();

// Lấy lịch sử vận chuyển
transportHistoriesRouter.get("/transports/:id/histories", authMiddleware, getTransportHistoriesController);

// Thêm điểm check-in mới
transportHistoriesRouter.post("/transports/:id/histories", authMiddleware, addCheckpointController);

// Cập nhật trạng thái
transportHistoriesRouter.put("/transports/:id/histories/:historyId", authMiddleware, updateCheckpointStatusController);

export default transportHistoriesRouter;