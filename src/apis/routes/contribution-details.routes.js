import express from "express";
import {
  getContributionDetailsController,
  addContributionItemsController,
  updateContributionItemController,
  deleteContributionItemController
} from "../controllers/contribution-details.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const contributionDetailsRouter = express.Router();

// Lấy chi tiết items đóng góp của 1 đơn đóng góp
contributionDetailsRouter.get("/relief-contributions/:id/details", authMiddleware, getContributionDetailsController);

// Thêm items
contributionDetailsRouter.post("/relief-contributions/:id/details", authMiddleware, addContributionItemsController);

// Cập nhật item
contributionDetailsRouter.put("/relief-contributions/:id/details/:detailId", authMiddleware, updateContributionItemController);

// Xóa item
contributionDetailsRouter.delete("/relief-contributions/:id/details/:detailId", authMiddleware, deleteContributionItemController);

export default contributionDetailsRouter;