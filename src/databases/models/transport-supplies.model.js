import mongoose, { Schema } from "mongoose";

// Vận chuyển hàng cứu trợ - chỉ là cái bảng trung gian giữa transport và rescue request --> tức là 1 transport có thể nhận nhiều rescue request, 1 rescue requese có thể được nhiều transport nhận đơn
const transportSuppliesSchema = new Schema(
  {
    // transportId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Transports",
    // },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicles",
    },
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
      // description: "Yêu cầu cứu trợ cần hỗ trợ",
    },
    amount: mongoose.Schema.Types.Mixed, //lưu lại danh sách hàng hỗ trợ cho đơn cứu trợ
    // pickupTime: Date,
    // deliveryTime: Date,
    // status: {
    //   type: String,
    //   enum: ["pending", "verified", "completed", "cancelled"],
    // },
    // deliveryLocation: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //   },
    //   coordinates: [Number],
    //   // description: "Tọa độ điểm giao hàng",
    // },
    // notes: String,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const TransportSupplies = mongoose.model(
  "TransportSupplies",
  transportSuppliesSchema
);
export default TransportSupplies;
