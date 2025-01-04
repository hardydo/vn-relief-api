import mongoose, { Schema } from "mongoose";

// Giao dịch tài chính
const financialTransactionSchema = new Schema(
  {
    naturalDisasterId: {
      type: Schema.Types.ObjectId,
      ref: "NaturalDisasters",
      required: true,
    },
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
    },
    rescueRequestItemsId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequestItems",
    },
    type: {
      type: String,
      enum: ["bank", "cash", "other"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    description: String,
    image: [String],
    amount: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const FinancialTransactions = mongoose.model(
  "FinancialTransactions",
  financialTransactionSchema
);
export default FinancialTransactions;
