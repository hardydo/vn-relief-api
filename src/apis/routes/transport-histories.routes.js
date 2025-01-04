import express from "express";
import {
  getTransportHistoriesController,
  addCheckpointController,
  updateCheckpointStatusController,
} from "../controllers/transport-histories.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transportHistoriesRouter = express.Router();

// Lấy lịch sử vận chuyển của phương tiện
transportHistoriesRouter.get(
  "/vehicles/:id",
  authMiddleware,
  getTransportHistoriesController
);

// Thêm điểm check-in mới
transportHistoriesRouter.post(
  "/vehicles/:id",
  authMiddleware,
  addCheckpointController
);

// Cập nhật trạng thái
transportHistoriesRouter.put(
  "/vehicles/:id/:historyId",
  authMiddleware,
  updateCheckpointStatusController
);

export default transportHistoriesRouter;
