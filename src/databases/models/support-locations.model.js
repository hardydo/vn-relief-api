import mongoose, { Schema } from "mongoose";

// Địa điểm hỗ trợ
const supportLocationSchema = new Schema(
  {
    verificationOfficerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    currentSituation: String,
    supportAbility: String,
    address: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      enum: ["temporary_stop", "residence", "warehouse", "other"],
      //điểm dừng nghỉ, tạm trú, kho tập kết, khác
    },
    phone: String,
    description: String,
    capacity: String, //sức chứa: 30 người, 100m2,...
    verificationStatus: {
      type: String,
      enum: ["active", "inactive"],
    },
    images: [String],
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
  },
  { timestamps: true }
);

const SupportLocations = mongoose.model(
  "SupportLocations",
  supportLocationSchema
);
export default SupportLocations;
