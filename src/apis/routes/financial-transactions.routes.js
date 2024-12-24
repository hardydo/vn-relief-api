import express from "express";
import {

} from "../controllers/table-status.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";

const financialTransactionRouter = express.Router();

// Lấy tất cả trạng thái bảng
financialTransactionRouter.get("/", authMiddleware, );

// Lấy ra các trạng thái của bảng
// :table là tên bảng 
financialTransactionRouter.get("/:table", authMiddleware, );

// Tạo mới trạng thái
financialTransactionRouter.post("/", authMiddleware, adminMiddleware, );

// Cập nhật trạng thái
financialTransactionRouter.put("/:id", authMiddleware, adminMiddleware, );

// Xóa trạng thái
financialTransactionRouter.delete("/:id", authMiddleware, adminMiddleware, );

export default financialTransactionRouter;