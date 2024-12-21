import mongoose, { Schema } from "mongoose";

// Đóng góp cứu trợ
const reliefContributionSchema = new Schema(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    donorType: {
      type: String,
      enum: ["individual", "organization", "other"],
      required: true,
    },
    transportScheduleId: {
      type: Schema.Types.ObjectId,
      ref: "TransportSchedules",
    },
    contributionType: {
      type: String,
      enum: ["money", "supplies", "other"],
      required: true,
    },
    //hình thức nhận đóng góp
    formOfReceipt: {
      type: String,
      enum: ["yourself", "other"], //tự mang tới | others là TNV/ai đó tự tới chỗ họ lấy
      required: true,
    },
    supportLocationId: {
      type: Schema.Types.ObjectId,
      ref: "SupportLocations",
    },
    phone: String,
    description: String,
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    images: [String],
    notes: String,
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
    sourceType: {
      type: String,
      enum: ["individual", "organization"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ReliefContributions = mongoose.model(
  "ReliefContributions",
  reliefContributionSchema
);
export default ReliefContributions;
