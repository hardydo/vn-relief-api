import mongoose, { Schema } from "mongoose";

// Bảng lưu các trạng thái của từng Bảng
/**
 * Ví dụ Bảng "yeu_cau_cuu_tro" có các trạng thái ["pending", "accepted", "in_progress", "completed", "cancelled"]
 */
const tableStatusSchema = new Schema(
  {
    referenceTable: {
      type: String,
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const TableStatuses = mongoose.model("TableStatuses", tableStatusSchema);
export default TableStatuses;
