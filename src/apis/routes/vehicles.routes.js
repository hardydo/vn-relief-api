import express from "express";
import {
  getVehiclesController,
  getVehicleByIdController,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController,
} from "../controllers/vehicles.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const vehiclesRouter = express.Router();

// Lấy danh sách phương tiện (filter: status, type)
// status: 'available' | 'in_use'
vehiclesRouter.get("/", authMiddleware, getVehiclesController);

// Lấy chi tiết phương tiện
vehiclesRouter.get("/:id", authMiddleware, getVehicleByIdController);

// Đăng ký phương tiện
vehiclesRouter.post("/", authMiddleware, createVehicleController);

// Cập nhật thông tin phương tiện
vehiclesRouter.put("/:id", authMiddleware, updateVehicleController);

// Xóa phương tiện
vehiclesRouter.delete("/:id", authMiddleware, deleteVehicleController);

export default vehiclesRouter;
