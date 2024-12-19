import express from "express";
import {
  getRequestItemsController,
  addRequestItemsController,
  updateRequestItemController,
  deleteRequestItemController
} from "../controllers/rescue-request-items.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const rescueRequestItemsRouter = express.Router();

// Lấy danh sách nhu yếu phẩm cần hỗ trợ của 1 đơn cứu trợ
rescueRequestItemsRouter.get("/rescue-requests/:id/items", authMiddleware, getRequestItemsController);

// Thêm nhu yếu phẩm
rescueRequestItemsRouter.post("/rescue-requests/:id/items", authMiddleware, addRequestItemsController);

// Cập nhật số lượng/thông tin
rescueRequestItemsRouter.put("/rescue-requests/:id/items/:itemId", authMiddleware, updateRequestItemController);

// Xóa item
rescueRequestItemsRouter.delete("/rescue-requests/:id/items/:itemId", authMiddleware, deleteRequestItemController);

export default rescueRequestItemsRouter;