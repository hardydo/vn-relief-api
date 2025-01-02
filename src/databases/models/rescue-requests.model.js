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
      verify: {
        type: String,
        enum: ["pending", "closed"],
      },
      recipient: {
        //người nhận đơn (cá nhân | đội cứu trợ | phương tiện | ...)
        type: String,
        enum: ["pending", "doing", "closed"],
      },
      // goods: {
      //   type: String,
      //   enum: ["pending", "doing", "closed"]
      // }
    },
    contentNeedsRelief: String,
    phone: String,
    senderType: String, //Gửi giúp, Tự gửi
    priorityContact: String,
    priorityPhone: String,
    // currentLocation: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     required: true,
    //   },
    //   coordinates: [Number],
    // },
    address: String,
    numberOfPeopleNeedingHelp: Number,
    images: [String],
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    // requiredRescueTime: Date, //6h, 12-24h
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const RescueRequests = mongoose.model("RescueRequests", rescueRequestSchema);
export default RescueRequests;
