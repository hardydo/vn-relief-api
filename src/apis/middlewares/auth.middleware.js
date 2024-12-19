import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Middleware kiểm tra token có hợp lệ không
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Không tìm thấy token xác thực'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Middleware kiểm tra xem số điện thoại có hợp lệ không
export const phoneAuthMiddleware = (req, res, next) => {
  const { phone } = req.body;
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Số điện thoại không hợp lệ'
    });
  }
  next();
};

// Middleware kiểm tra login request
export const loginMiddleware = (req, res, next) => {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu'
    });
  }
  next();
};

// Middleware xác thực mã OTP
export const verifyOTPMiddleware = (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Vui lòng nhập đầy đủ số điện thoại và mã OTP'
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Mã OTP không hợp lệ'
    });
  }
  next();
};