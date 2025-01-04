import express from "express";
import {
  getTransportSuppliesController,
  addSupplyToTransportController,
  removeSupplyFromTransportController,
  updateSupplyStatusController,
  distributeSuppliesController,
  handleReceiveGoodsFromSupportLocation,
  handleCheckExistVehicleReceiveRescueRequest,
} from "../controllers/transport-supplies.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transportSuppliesRouter = express.Router();

// Kiểm tra xem phương tiện đã nhận đơn cứu trợ hay chưa
transportSuppliesRouter.post(
  "/check-vehicle-exist",
  authMiddleware,
  handleCheckExistVehicleReceiveRescueRequest
);

// Nhận đơn cứu trợ từ điểm tập kết
transportSuppliesRouter.post(
  "/",
  authMiddleware,
  handleReceiveGoodsFromSupportLocation
);

//============== a Lộc hiểu sai ý, nên các cái dưới coi như bỏ
// Lấy danh sách hàng đang vận chuyển
transportSuppliesRouter.get(
  "/transports/:id/supplies",
  authMiddleware,
  getTransportSuppliesController
);

// Thêm hàng vào chuyến
// transportSuppliesRouter.post(
//   "/transports/:id/supplies",
//   authMiddleware,
//   addSupplyToTransportController
// );

// Xóa hàng khỏi chuyến
transportSuppliesRouter.delete(
  "/transports/:id/supplies/:supplyId",
  authMiddleware,
  removeSupplyFromTransportController
);

// Cập nhật trạng thái
transportSuppliesRouter.put(
  "/transports/:id/supplies/:supplyId/status",
  authMiddleware,
  updateSupplyStatusController
);

// Phân phối hàng hóa tại điểm đích
transportSuppliesRouter.post(
  "/transports/:id/supplies/distribute",
  authMiddleware,
  distributeSuppliesController
);

export default transportSuppliesRouter;
