import mongoose, { Schema } from "mongoose";

// Chi tiết đóng góp cứu trợ
const contributionDetailSchema = new Schema(
  {
    contributionId: {
      type: Schema.Types.ObjectId,
      ref: "ReliefContributions",
      required: true,
    },
    itemType: String,
    unit: String,
    providedQuantity: Number,
    remainingQuantity: Number,
    notes: String,
    status: String,
  },
  { timestamps: true }
);

const ContributionDetails = mongoose.model(
  "ContributionDetails",
  contributionDetailSchema
);
export default ContributionDetails;
