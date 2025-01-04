import express from "express";
import {
  getRescueRequestsController,
  getRescueRequestByIdController,
  createRescueRequestController,
  updateRescueRequestController,
  deleteRescueRequestController,
  verifyRescueRequestController,
  updateStatusController,
  assignTeamController,
  getReceivedRequestsController,
} from "../controllers/rescue-requests.controller.js";
import {
  authMiddleware,
  verifierMiddleware,
} from "../middlewares/auth.middleware.js";

const rescueRequestsRouter = express.Router();

// Lấy danh sách các vehicles/user hỗ trợ cho 1 đơn rescuerequest
// Query: status, type, area, nearby
rescueRequestsRouter.get(
  "/received-request/:rescueRequestId",
  authMiddleware,
  getReceivedRequestsController
);

// Lấy danh sách yêu cầu cứu trợ
// Query: status, type, area, nearby
rescueRequestsRouter.get("/", authMiddleware, getRescueRequestsController);

// Chi tiết yêu cầu
rescueRequestsRouter.get(
  "/:id",
  authMiddleware,
  getRescueRequestByIdController
);

// Tạo yêu cầu mới
rescueRequestsRouter.post("/", authMiddleware, createRescueRequestController);

// Cập nhật yêu cầu (chỉ được cập nhật trước khi có đội nhận)
rescueRequestsRouter.put("/:id", authMiddleware, updateRescueRequestController);

// Xóa yêu cầu (chỉ được xóa khi chưa có đội nhận)
rescueRequestsRouter.delete(
  "/:id",
  authMiddleware,
  deleteRescueRequestController
);

// Xác minh yêu cầu (TNV xác minh)
rescueRequestsRouter.put(
  "/:id/verify",
  authMiddleware,
  verifierMiddleware,
  verifyRescueRequestController
);

// Cập nhật trạng thái (chỉ đội cứu trợ)
rescueRequestsRouter.put("/:id/status", authMiddleware, updateStatusController);

// Phân công cho đội (TNV role xác minh)
rescueRequestsRouter.post(
  "/:id/assign/:teamId",
  authMiddleware,
  verifierMiddleware,
  assignTeamController
);

export default rescueRequestsRouter;
