import mongoose, { Schema } from "mongoose";

// Giao dịch tài chính
const financialTransactionSchema = new Schema(
  {
    naturalDisasterId: {
      type: Schema.Types.ObjectId,
      ref: "NaturalDisasters",
    },
    rescueRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RescueRequests",
    },
    type: {
      type: String,
      enum: ["bank", "cash", "other"],
    },
    executorId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    description: String,
    image: [String],
    amount: Number,
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
