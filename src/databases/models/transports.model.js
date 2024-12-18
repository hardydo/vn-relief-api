import mongoose, { Schema } from "mongoose";

// Vận chuyển
const transportSchema = new Schema(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicles",
      required: true,
      description: "Phương tiện thực hiện vận chuyển",
    },
    pickupLocationId: {
      type: Schema.Types.ObjectId,
      ref: "SupportLocations",
      required: true,
      description: "Địa điểm lấy hàng/điểm tập kết",
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
      description: "Tọa độ điểm lấy hàng",
    },
    notes: String,
  },
  { timestamps: true }
);

const Transports = mongoose.model("Transports", transportSchema);
export default Transports;
