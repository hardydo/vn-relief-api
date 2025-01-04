import ResponseStatus from "../../response-handler/response-handler.js";
import FinancialTransactions from "../../databases/models/financial-transactions.model.js";
import Users from "../../databases/models/users.model.js";
import PayOS from "@payos/node";
import VARIABLE_GLOBAL from "../../variables/global.js";

const payOS = new PayOS(
  VARIABLE_GLOBAL.PAYOS_CLIENT_ID,
  VARIABLE_GLOBAL.PAYOS_API_KEY,
  VARIABLE_GLOBAL.PAYOS_CHECKSUM_KEY
);

//=========================
//save good persional
export const handleSaveGoods = async (req, res) => {
  try {
    //đơn nào ? ai cung cấp ? cung cấp những gì ?
    const { userId, amount } = req.body;
    const { id: rescueRequestId } = req.params;

    const naturalDisasterId = req.headers["naturaldisasterid"];

    const transactions = await FinancialTransactions.create({
      type: "other",
      userId, //ai hỗ trợ
      rescueRequestId, //hỗ trợ cho đơn nào
      naturalDisasterId, //đợt thiên tai nào
      amount, //hỗ trợ những gì, số lượng, vật phẩm,...
      status: "pending",
    });

    return ResponseStatus.ok(res, transactions);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

//=========================

// Lấy danh sách giao dịch
export const getTransactionsController = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let query = {};
    if (type) {
      query.type = type;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await FinancialTransactions.find(query)
      .populate("executorId", "name phone")
      .populate("verifierId", "name phone")
      .sort({ createdAt: -1 });

    return ResponseStatus.ok(res, transactions);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Chi tiết giao dịch
export const getTransactionByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await FinancialTransactions.findById(id)
      .populate("executorId", "name phone")
      .populate("verifierId", "name phone");

    if (!transaction) {
      return ResponseStatus.notfound(res);
    }

    return ResponseStatus.ok(res, transaction);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Ghi nhận giao dịch tiền mặt
export const createCashTransactionController = async (req, res) => {
  try {
    const { phone, cccd, ...transactionData } = req.body;

    // Kiểm tra/tạo user từ số điện thoại
    let donor = await Users.findOne({ phone });
    if (!donor) {
      donor = await Users.create({
        phone,
        password: phone,
        role: "thanh_vien_thuong",
        status: "active",
        name: `Thanh vien ${phone}`,
        cccd,
      });
    }

    const newTransaction = await FinancialTransactions.create({
      ...transactionData,
      type: "cash",
      executorId: donor._id,
      status: "pending",
    });
    const result = {
      message: "Đã tiếp nhận đơn thanh toán",
      data: newTransaction,
    };
    return ResponseStatus.created(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Cập nhật giao dịch tiền mặt
export const updateCashTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await FinancialTransactions.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return ResponseStatus.notfound(res);
    }
    const result = {
      data: updated,
      message: "Cập nhật thông ting giao dịch thành công",
    };
    return ResponseStatus.ok(res, result);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Tạo giao dịch VNPAY
export const createVNPayTransactionController = async (req, res) => {
  try {
    const { amount, ...transactionData } = req.body;
    //test payos
    const order = {
      amount: 10000,
      description: "Test",
      orderCode: 10,
      returnUrl: "https://www.facebook.com/dwchau",
      cancelUrl: "https://www.facebook.com/walter.19.12",
    };
    // Lưu thông tin giao dịch
    const paymentLink = await payOS.createPaymentLink(order);
    const newTransaction = await FinancialTransactions.create({
      ...transactionData,
      amount,
      type: "bank",
      executorId: req.user?._id || "676452c5b85460f14f0b1d76",
      status: "pending",
    });
    return res.redirect(303, paymentLink.checkoutUrl);
    // return ResponseStatus.created(res, {
    //   transaction: newTransaction,
    //   paymentUrl,
    // });
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Callback VNPAY
export const handleVNPayCallbackController = async (req, res) => {
  try {
    const vnpayParams = req.query;

    // TODO: Xác thực callback từ VNPAY

    // Cập nhật trạng thái giao dịch
    const transactionId = ""; // Lấy từ vnpayParams
    await FinancialTransactions.findByIdAndUpdate(transactionId, {
      $set: { status: "approved" },
    });

    return ResponseStatus.ok(res, "Thanh toán thành công");
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};

// Danh sách phương thức thanh toán
export const getPaymentMethodsController = async (req, res) => {
  try {
    const methods = [
      {
        id: "cash",
        name: "Tiền mặt",
        description: "Thanh toán bằng tiền mặt",
      },
      {
        id: "vnpay",
        name: "VNPAY",
        description: "Thanh toán qua VNPAY",
      },
      // Thêm các phương thức khác
    ];

    return ResponseStatus.ok(res, methods);
  } catch (error) {
    console.log(error);
    return ResponseStatus.error(res, error);
  }
};
