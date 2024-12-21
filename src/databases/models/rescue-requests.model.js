import mongoose, { Schema } from "mongoose";

// Yêu cầu cứu trợ
const rescueRequestSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["emergency", "supplies", "other"],
      required: true,
    },
    informantId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    wardCode: String, //mã xã | mã tỉnh | mã huyện --> "01 | 23 | 34",
    description: String,
    title: String,
    status: {
      type: String,
      enum: ["pending", "doing", "closed"]
    },
    phone: String,
    priorityContact: String,
    priorityPhone: String,
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: [Number],
    },
    address: String,
    numberOfPeopleNeedingHelp: Number,
    images: [String],
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    requiredRescueTime: Date, //6h, 12-24h
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const RescueRequests = mongoose.model("RescueRequests", rescueRequestSchema);
export default RescueRequests;
