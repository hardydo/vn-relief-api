import mongoose, { Schema } from "mongoose";

// Đóng góp cứu trợ
const reliefContributionSchema = new Schema(
  {
    donorName: String, //không cần nối đến user đâu, để tên là được
    // donorType: {
    //   type: String, //ai đóng góp, cá nhân, tổ chức, khác
    //   enum: ["individual", "organization", "other"],
    // },
    // transportId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Transports",
    // },
    // contributionType: {
    //   type: String,
    //   enum: ["money", "supplies", "other"],
    // },
    //hình thức nhận đóng góp
    // formOfReceipt: {
    //   type: String,
    //   enum: ["yourself", "other"], //tự mang tới | others là TNV/ai đó tự tới chỗ họ lấy
    // },
    supportLocationId: {
      type: Schema.Types.ObjectId,
      ref: "SupportLocations",
    },
    phone: String,
    description: String,
    // currentLocation: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //   },
    //   coordinates: [Number],
    // },
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    // images: [String],
    // notes: String,
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34"
    address: String, //địa chỉ cụ thể để biết mà vinh danh hehe
    // sourceType: {
    //   type: String,
    //   enum: ["individual", "organization"],
    // },
    // status: {
    //   type: String,
    //   enum: ["pending", "accept", "decline"],
    // },
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
