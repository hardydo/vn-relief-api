import ResponseStatus from "../../response-handler/response-handler.js";
import { firebase } from "../../lib/firebase.js";

// Gửi OTP tới số điện thoại
export const sendOTPController = async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Gửi OTP qua Firebase
    const confirmationResult = await firebase.auth().signInWithPhoneNumber(phone);
    
    return ResponseStatus.ok(res, {
      verificationId: confirmationResult.verificationId,
      message: "OTP đã được gửi thành công"
    });
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error);
    return ResponseStatus.error(res, "Có lỗi xảy ra khi gửi OTP");
  }
};

// Xác thực OTP
export const verifyOTPController = async (req, res) => {
  try {
    const { verificationId, otp } = req.body;

    // Xác thực OTP với Firebase
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      otp
    );
    const result = await firebase.auth().signInWithCredential(credential);

    return ResponseStatus.ok(res, {
      user: result.user,
      message: "Xác thực OTP thành công"
    });
  } catch (error) {
    console.error("Lỗi khi xác thực OTP:", error);
    return ResponseStatus.badRequest(res, "Mã OTP không hợp lệ");
  }
};

// Đăng nhập bằng số điện thoại + password
export const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Kiểm tra thông tin đăng nhập
    const userCredential = await firebase.auth().signInWithEmailAndPassword(
      `${phone}@domain.com`, // Firebase yêu cầu email format
      password
    );

    return ResponseStatus.ok(res, {
      user: userCredential.user,
      message: "Đăng nhập thành công"
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return ResponseStatus.unauthorized(res, "Thông tin đăng nhập không hợp lệ");
  }
};

// Đăng xuất
export const logoutController = async (req, res) => {
  try {
    await firebase.auth().signOut();
    return ResponseStatus.ok(res, "Đăng xuất thành công");
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return ResponseStatus.error(res, "Có lỗi xảy ra khi đăng xuất");
  }
};