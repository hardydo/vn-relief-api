import express from "express";
import {
  getDisasterInfoController,
  getDisasterInfoByIdController,
  createDisasterInfoController,
  updateDisasterInfoController,
  deleteDisasterInfoController
} from "../controllers/disaster-information.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const disasterInformationRouter = express.Router();

// Lấy danh sách thông tin thiên tai của 1 đợt
// Query: type, area, startDate, endDate
disasterInformationRouter.get("/:disasterId/disaster-information", authMiddleware, getDisasterInfoController);

// Chi tiết một thông tin thiên tai
disasterInformationRouter.get("/:disasterId/disaster-information/:id", authMiddleware, getDisasterInfoByIdController);

// Thêm thông tin thiên tai mới
disasterInformationRouter.post("/:disasterId/disaster-information", authMiddleware, createDisasterInfoController);

// Cập nhật thông tin thiên tai
disasterInformationRouter.put("/:disasterId/disaster-information/:id", authMiddleware, updateDisasterInfoController);

// Xóa thông tin thiên tai
disasterInformationRouter.delete("/:disasterId/disaster-information/:id", authMiddleware, deleteDisasterInfoController);

export default disasterInformationRouter;