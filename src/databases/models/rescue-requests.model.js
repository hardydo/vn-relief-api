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
    address: String,
    requiredRescueTime: Date,
    title: String,
    description: String,
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
    detailedLocation: String,
    numberOfPeopleNeedingHelp: Number,
    images: [String],
    status: String,
    detailsLink: String,
    rescueProgressUpdate: String,
  },
  { timestamps: true }
);

const RescueRequests = mongoose.model("RescueRequests", rescueRequestSchema);
export default RescueRequests;
