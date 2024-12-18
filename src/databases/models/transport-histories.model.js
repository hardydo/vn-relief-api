import mongoose, { Schema } from "mongoose";

// Lịch trình vận chuyển
const transportHistorySchema = new Schema(
  {
    transportId: {
      type: Schema.Types.ObjectId,
      ref: "Transports",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", // Chờ thực hiện
        "picking_up", // Đang lấy hàng
        "in_transit", // Đang vận chuyển
        "delivering", // Đang phân phát
        "completed", // Hoàn thành
        "cancelled", // Đã hủy
      ],
      required: true,
      default: "pending",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    notes: String,
  },
  { timestamps: true }
);

const TransportHistories = mongoose.model(
  "TransportHistories",
  transportHistorySchema
);
export default TransportHistories;
