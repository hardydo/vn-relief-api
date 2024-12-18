import { Router } from "express";

const TransactionsRouter = Router();

// Lấy danh sách tất cả giao dịch tài chính
TransactionsRouter.get("/");

// Lấy chi tiết giao dịch tài chính
TransactionsRouter.get("/:id");

// Tạo giao dịch VNPAY
TransactionsRouter.post("/vnpay/create");

// Callback VNPAY (xử lý kết quả thanh toán từ VNPay)
TransactionsRouter.post("/vnpay/callback");

// Ghi nhận tiền mặt từ người dân đóng góp (đã định nghĩa trước đó)
TransactionsRouter.post("/cash/record");

// Phương thức thanh toán (lấy danh sách các phương thức thanh toán)
TransactionsRouter.get("/payment-methods");

export default TransactionsRouter;
