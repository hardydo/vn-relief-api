import mongoose, { Schema } from "mongoose";

// Chi tiết yêu cầu cứu trợ
const rescueRequestItemSchema = new Schema(
  {
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
    },
    itemType: String,
    providedQuantity: Number,
    remainingQuantity: Number,
    unit: String,
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    notes: String,
  },
  { timestamps: true }
);

const RescueRequestItems = mongoose.model(
  "RescueRequestItems",
  rescueRequestItemSchema
);
export default RescueRequestItems;
