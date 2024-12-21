import mongoose, { Schema } from "mongoose";

// Vận chuyển
const transportSchema = new Schema(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicles",
      // description: "Phương tiện thực hiện vận chuyển",
    },
    pickupLocationId: {
      type: Schema.Types.ObjectId,
      ref: "SupportLocations",
      // description: "Địa điểm lấy hàng/điểm tập kết",
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
      // description: "Tọa độ điểm lấy hàng",
    },
    notes: String,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Transports = mongoose.model("Transports", transportSchema);
export default Transports;
