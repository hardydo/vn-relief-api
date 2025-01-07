import express from "express";
import {
  getSupportLocationsController,
  getSupportLocationByIdController,
  createSupportLocationController,
  updateSupportLocationController,
  deleteSupportLocationController,
  receiveSuppliesController,
  getNearbyLocationsController,
  getSupportLocationsReveicedController,
  getLocationsByTypeController,
} from "../controllers/support-locations.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const supportLocationsRouter = express.Router();

// Lấy danh sách địa điểm mà phương tiện đã nhận hàng
supportLocationsRouter.get(
  "/vehicle-received/:vehicleId",
  authMiddleware,
  getSupportLocationsReveicedController
);

// Lấy danh sách địa điểm theo user/all (kèm thông tin hàng hóa)
// from: userId (lấy danh sách địa điểm của 1 user) hoặc all (lấy hết)
supportLocationsRouter.get(
  "/user/:from",
  authMiddleware,
  getSupportLocationsController
);

// Lấy danh sách địa điểm theo type (tạm trú, ....) (kèm thông tin hàng hóa)
supportLocationsRouter.get(
  "/filter/by-type",
  authMiddleware,
  getLocationsByTypeController
);

// Lấy chi tiết địa điểm
supportLocationsRouter.get(
  "/:id",
  authMiddleware,
  getSupportLocationByIdController
);

// Thêm địa điểm mới
supportLocationsRouter.post(
  "/type/:type",
  authMiddleware,
  createSupportLocationController
);

// Cập nhật thông tin địa điểm
supportLocationsRouter.put(
  "/:id",
  authMiddleware,
  updateSupportLocationController
);

// Xóa địa điểm
supportLocationsRouter.delete(
  "/:id",
  authMiddleware,
  deleteSupportLocationController
);

// Tiếp nhận hàng hóa tại địa điểm
supportLocationsRouter.post(
  "/:id/receive",
  authMiddleware,
  receiveSuppliesController
);

// Tìm địa điểm gần nhất
supportLocationsRouter.get(
  "/location/nearby",
  authMiddleware,
  getNearbyLocationsController
);

export default supportLocationsRouter;
