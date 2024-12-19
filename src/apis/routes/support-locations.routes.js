import express from "express";
import {
  getSupportLocationsController,
  getSupportLocationByIdController,
  createSupportLocationController,
  updateSupportLocationController,
  deleteSupportLocationController,
  receiveSuppliesController,
  getNearbyLocationsController
} from "../controllers/support-locations.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const supportLocationsRouter = express.Router();

// Lấy danh sách địa điểm (kèm thông tin hàng hóa)
// filter - type: "temporary_stop" | "residence" | "warehouse" | "all" | "other"
supportLocationsRouter.get("/", authMiddleware, getSupportLocationsController);

// Lấy chi tiết địa điểm
supportLocationsRouter.get("/:id", authMiddleware, getSupportLocationByIdController);

// Thêm địa điểm mới
supportLocationsRouter.post("/", authMiddleware, createSupportLocationController);

// Cập nhật thông tin địa điểm
supportLocationsRouter.put("/:id", authMiddleware, updateSupportLocationController);

// Xóa địa điểm
supportLocationsRouter.delete("/:id", authMiddleware, deleteSupportLocationController);

// Tiếp nhận hàng hóa tại địa điểm
supportLocationsRouter.post("/:id/receive", authMiddleware, receiveSuppliesController);

// Tìm địa điểm gần nhất
supportLocationsRouter.get("/nearby", authMiddleware, getNearbyLocationsController);

export default supportLocationsRouter;