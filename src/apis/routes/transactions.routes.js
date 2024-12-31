import express from "express";
import {
  getTransactionsController,
  getTransactionByIdController,
  createCashTransactionController,
  updateCashTransactionController,
  createVNPayTransactionController,
  handleVNPayCallbackController,
  getPaymentMethodsController
} from "../controllers/transactions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const transactionsRouter = express.Router();

// Lấy danh sách giao dịch
// filter - type: 'bank' | 'cash' | 'rescue-request'
transactionsRouter.get("/", authMiddleware, getTransactionsController);

// Lấy chi tiết giao dịch
transactionsRouter.get("/:id", authMiddleware, getTransactionByIdController);

// Ghi nhận giao dịch tiền mặt
transactionsRouter.post("/cash", authMiddleware, createCashTransactionController);

// Cập nhật giao dịch tiền mặt
transactionsRouter.put("/cash/:id", authMiddleware, updateCashTransactionController);

// Tạo giao dịch VNPAY
transactionsRouter.post("/payos/create", authMiddleware, createVNPayTransactionController);

// Callback VNPAY
transactionsRouter.post("/payos/callback", handleVNPayCallbackController);

// Danh sách phương thức thanh toán
transactionsRouter.get("/payment-methods", authMiddleware, getPaymentMethodsController);

export default transactionsRouter;