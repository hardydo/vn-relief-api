import express from "express";
import {
  sendOTPController,
  verifyOTPController,
  loginController,
  logoutController
} from "../controllers/auth.controller.js";
import {
  phoneAuthMiddleware,
  loginMiddleware
} from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Gửi OTP tới số điện thoại
authRouter.post("/phone/send-otp", phoneAuthMiddleware, sendOTPController);

// Xác thực OTP 
authRouter.post("/phone/verify-otp", verifyOTPController);

// Đăng nhập bằng số điện thoại + password
authRouter.post("/phone/login", loginMiddleware, loginController);

// Đăng xuất
authRouter.post("/logout", logoutController);

export default authRouter;