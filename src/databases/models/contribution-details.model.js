import mongoose, { Schema } from "mongoose";

// Chi tiết đóng góp cứu trợ
const contributionDetailSchema = new Schema(
  {
    reliefContributionId: {
      type: Schema.Types.ObjectId,
      ref: "ReliefContributions",
    },
    transportId: {
      type: Schema.Types.ObjectId,
      ref: "Transports",
    },
    name: String,
    unit: String,
    providedQuantity: Number,
    remainingQuantity: Number,
    // notes: String,
    // status: String,
    // locationId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "SupportLocations",
    //   default: null,
    // },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ContributionDetails = mongoose.model(
  "ContributionDetails",
  contributionDetailSchema
);
export default ContributionDetails;
