import mongoose, { Schema } from "mongoose";

// Giao dịch tài chính
const financialTransactionSchema = new Schema(
  {
    naturalDisasterId: {
      type: Schema.Types.ObjectId,
      ref: "NaturalDisasters",
    },
    transactionTime: Date,
    amount: Number,
    content: String,
    executor: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    approverId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    description: String,
    image: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
    },
  },
  { timestamps: true }
);

const FinancialTransactions = mongoose.model(
  "FinancialTransactions",
  financialTransactionSchema
);
export default FinancialTransactions;
