import express from "express";
import {
  getContributionsController,
  getContributionByIdController,
  createContributionController,
  updateContributionController,
  deleteContributionController
} from "../controllers/relief-contributions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const reliefContributionsRouter = express.Router();

// Lấy danh sách đóng góp
// filter - type: 'money' | 'supplies' | 'other'
// status: 'pending' | 'received' | 'distributed'
reliefContributionsRouter.get("/", authMiddleware, getContributionsController);

// Lấy chi tiết đóng góp
reliefContributionsRouter.get("/:id", authMiddleware, getContributionByIdController);

// Tạo đóng góp mới (tạo account nếu chưa có, gửi OTP)
reliefContributionsRouter.post("/", createContributionController);

// Cập nhật đóng góp
reliefContributionsRouter.put("/:id", authMiddleware, updateContributionController);

// Xóa đóng góp
reliefContributionsRouter.delete("/:id", authMiddleware, deleteContributionController);

export default reliefContributionsRouter;