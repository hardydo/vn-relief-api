import mongoose, { Schema } from "mongoose";

// Vận chuyển hàng cứu trợ
const transportSuppliesSchema = new Schema(
  {
    transportId: {
      type: Schema.Types.ObjectId,
      ref: "Transports",
    },
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
      // description: "Yêu cầu cứu trợ cần hỗ trợ",
    },
    pickupTime: Date,
    deliveryTime: Date,
    status: {
      type: String,
      enum: ["pending", "verified", "completed", "cancelled"],
    },
    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
      // description: "Tọa độ điểm giao hàng",
    },
    notes: String,
  },
  { timestamps: true }
);

const TransportSupplies = mongoose.model(
  "TransportSupplies",
  transportSuppliesSchema
);
export default TransportSupplies;
